import os, json, re, sqlite3, uuid, hmac, hashlib
from datetime import datetime, timezone
from typing import Optional
from fastapi import FastAPI, Request, HTTPException, UploadFile, File, Header
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.getenv("DUKAANMITRA_DB", os.path.join(BASE_DIR, "dukaanmitra.db"))
APP_SECRET = os.getenv("APP_SECRET", "dev-only-change-me")
WA_VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "")
WA_APP_SECRET = os.getenv("WHATSAPP_APP_SECRET", "")
WA_ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN", "")
WA_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
MAX_UPLOAD_BYTES = 8 * 1024 * 1024

app = FastAPI(title="DukaanMitra Universal Business AI", version="0.1.0")
uploads_dir = os.path.join(BASE_DIR, "uploads")
static_dir = os.path.join(BASE_DIR, "static")
os.makedirs(uploads_dir, exist_ok=True)
if os.path.isdir(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

def now():
    return datetime.now(timezone.utc).isoformat()

def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    return conn

def init_db():
    with db() as c:
        c.executescript("""
        CREATE TABLE IF NOT EXISTS businesses(
          id TEXT PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL,
          currency TEXT NOT NULL DEFAULT 'INR', created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS users(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, display_name TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('owner','manager','staff','viewer')),
          created_at TEXT NOT NULL, FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        CREATE TABLE IF NOT EXISTS products(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL,
          sku TEXT, category TEXT, unit TEXT NOT NULL DEFAULT 'pcs',
          quantity REAL NOT NULL DEFAULT 0, reorder_level REAL NOT NULL DEFAULT 0,
          cost_price REAL, selling_price REAL, batch TEXT, expiry_date TEXT,
          attributes_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL, FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        CREATE INDEX IF NOT EXISTS idx_products_business ON products(business_id);
        CREATE TABLE IF NOT EXISTS stock_movements(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, product_id TEXT NOT NULL,
          delta REAL NOT NULL, reason TEXT NOT NULL, actor_id TEXT,
          created_at TEXT NOT NULL, FOREIGN KEY(product_id) REFERENCES products(id)
        );
        CREATE TABLE IF NOT EXISTS knowledge(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, title TEXT NOT NULL,
          body TEXT NOT NULL, tags TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS audit_log(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, actor_id TEXT,
          action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
          details_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS pending_actions(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, actor_id TEXT,
          action_type TEXT NOT NULL, payload_json TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS channel_links(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, channel TEXT NOT NULL,
          external_user_id TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'staff',
          created_at TEXT NOT NULL, UNIQUE(channel, external_user_id)
        );
        """)

init_db()

TEMPLATES = {
 "retail": {"label":"Retail / Kirana","fields":["sku","category","unit","quantity","reorder_level","cost_price","selling_price","batch","expiry_date"],"defaults":{"unit":"pcs","reorder_level":5}},
 "grocery": {"label":"Grocery & Perishables","fields":["sku","category","unit","quantity","reorder_level","cost_price","selling_price","batch","expiry_date"],"defaults":{"unit":"kg","reorder_level":3}},
 "pharmacy": {"label":"Pharmacy","fields":["sku","category","unit","quantity","reorder_level","cost_price","selling_price","batch","expiry_date"],"defaults":{"unit":"strip","reorder_level":5,"expiry_date":"required"}},
 "restaurant": {"label":"Restaurant / Kitchen","fields":["sku","category","unit","quantity","reorder_level","cost_price","batch","expiry_date"],"defaults":{"unit":"kg","reorder_level":2}},
 "warehouse": {"label":"Warehouse","fields":["sku","category","unit","quantity","reorder_level","cost_price","selling_price","batch","expiry_date"],"defaults":{"unit":"pcs","reorder_level":10}},
 "manufacturing": {"label":"Manufacturing","fields":["sku","category","unit","quantity","reorder_level","cost_price","batch"],"defaults":{"unit":"pcs","reorder_level":10}},
 "services": {"label":"Service Business","fields":["sku","category","unit","quantity","reorder_level","cost_price"],"defaults":{"unit":"pcs","reorder_level":2}},
}

class BusinessIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    kind: str = "retail"
    owner_name: str = "Owner"

class ProductIn(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    sku: Optional[str] = None
    category: Optional[str] = None
    unit: str = "pcs"
    quantity: float = 0
    reorder_level: float = 0
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None
    batch: Optional[str] = None
    expiry_date: Optional[str] = None
    attributes: dict = {}

class StockChange(BaseModel):
    product_id: str
    delta: float
    reason: str = "manual adjustment"
    actor_id: Optional[str] = None

class KnowledgeIn(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    body: str = Field(min_length=1, max_length=10000)
    tags: str = ""

class CommandIn(BaseModel):
    business_id: str
    command: str
    actor_id: Optional[str] = None

class ConfirmIn(BaseModel):
    approve: bool

def audit(c, business_id, action, entity_type, entity_id=None, actor_id=None, details=None):
    c.execute("INSERT INTO audit_log VALUES(?,?,?,?,?,?,?,?)",
        (str(uuid.uuid4()), business_id, actor_id, action, entity_type, entity_id,
         json.dumps(details or {}, ensure_ascii=False), now()))

def get_business(c, business_id):
    row = c.execute("SELECT * FROM businesses WHERE id=?", (business_id,)).fetchone()
    if not row: raise HTTPException(404, "Business not found")
    return dict(row)

def role_for(c, business_id, actor_id):
    if not actor_id:
        return "owner" if os.getenv("ALLOW_DEMO_OWNER", "true").lower() == "true" else "viewer"
    r = c.execute("SELECT role FROM users WHERE id=? AND business_id=?", (actor_id,business_id)).fetchone()
    if not r: raise HTTPException(403, "User is not a member of this business")
    return r["role"]

def require_role(role, allowed):
    if role not in allowed: raise HTTPException(403, f"Role '{role}' cannot perform this action")

def product_dict(r):
    d = dict(r); d["attributes"] = json.loads(d.pop("attributes_json") or "{}"); return d

@app.get("/", response_class=HTMLResponse)
@app.get("/verify", response_class=HTMLResponse)
@app.get("/admin", response_class=HTMLResponse)
@app.get("/admin/whatsapp", response_class=HTMLResponse)
@app.get("/dev-console", response_class=HTMLResponse)
def home():
    import pathlib
    base = pathlib.Path(__file__).resolve().parent
    with open(base / "static" / "index.html", encoding="utf-8") as f: return f.read()

@app.get("/api/health")
def health():
    return {"ok": True, "service":"dukaanmitra", "version":"0.1.0", "whatsapp_configured":bool(WA_ACCESS_TOKEN and WA_PHONE_NUMBER_ID)}

@app.get("/api/templates")
def templates():
    return TEMPLATES

@app.post("/api/businesses")
def create_business(body: BusinessIn):
    if body.kind not in TEMPLATES: raise HTTPException(400, "Unknown business template")
    bid, uid = str(uuid.uuid4()), str(uuid.uuid4())
    with db() as c:
        c.execute("INSERT INTO businesses VALUES(?,?,?,?,?)",(bid,body.name,body.kind,"INR",now()))
        c.execute("INSERT INTO users VALUES(?,?,?,?,?)",(uid,bid,body.owner_name,"owner",now()))
        audit(c,bid,"business.created","business",bid,uid,{"kind":body.kind})
    return {"business_id":bid,"owner_id":uid,"name":body.name,"kind":body.kind,"template":TEMPLATES[body.kind]}

@app.get("/api/businesses/{business_id}")
def business_detail(business_id: str):
    with db() as c: return get_business(c,business_id)

@app.get("/api/businesses/{business_id}/products")
def list_products(business_id: str, q: str = ""):
    with db() as c:
        get_business(c,business_id)
        rows=c.execute("SELECT * FROM products WHERE business_id=? AND (name LIKE ? OR COALESCE(sku,'') LIKE ?) ORDER BY name",
                       (business_id,f"%{q}%",f"%{q}%")).fetchall()
        return [product_dict(r) for r in rows]

@app.post("/api/businesses/{business_id}/products")
def create_product(business_id: str, body: ProductIn, actor_id: Optional[str] = None):
    with db() as c:
        get_business(c,business_id)
        role=require_role(role_for(c,business_id,actor_id),{"owner","manager","staff"})
        pid=str(uuid.uuid4()); ts=now()
        c.execute("""INSERT INTO products(id,business_id,name,sku,category,unit,quantity,reorder_level,cost_price,selling_price,batch,expiry_date,attributes_json,created_at,updated_at)
                     VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                  (pid,business_id,body.name,body.sku,body.category,body.unit,body.quantity,body.reorder_level,body.cost_price,body.selling_price,body.batch,body.expiry_date,json.dumps(body.attributes),ts,ts))
        if body.quantity:
            c.execute("INSERT INTO stock_movements VALUES(?,?,?,?,?,?,?)",(str(uuid.uuid4()),business_id,pid,body.quantity,"opening stock",actor_id,ts))
        audit(c,business_id,"product.created","product",pid,actor_id,body.model_dump())
        return {"id":pid,"status":"created"}

@app.patch("/api/businesses/{business_id}/products/{product_id}")
def edit_product(business_id: str, product_id: str, body: ProductIn, actor_id: Optional[str] = None):
    with db() as c:
        require_role(role_for(c,business_id,actor_id),{"owner","manager","staff"})
        old=c.execute("SELECT * FROM products WHERE id=? AND business_id=?",(product_id,business_id)).fetchone()
        if not old: raise HTTPException(404,"Product not found")
        if body.quantity != old["quantity"]:
            raise HTTPException(400,"Use the stock-movement endpoint to change quantity; this preserves the ledger.")
        c.execute("""UPDATE products SET name=?,sku=?,category=?,unit=?,reorder_level=?,cost_price=?,selling_price=?,batch=?,expiry_date=?,attributes_json=?,updated_at=? WHERE id=? AND business_id=?""",
            (body.name,body.sku,body.category,body.unit,body.reorder_level,body.cost_price,body.selling_price,body.batch,body.expiry_date,json.dumps(body.attributes),now(),product_id,business_id))
        audit(c,business_id,"product.updated","product",product_id,actor_id,body.model_dump())
        return {"status":"updated"}

@app.post("/api/businesses/{business_id}/stock-movements")
def stock_change(business_id: str, body: StockChange):
    with db() as c:
        require_role(role_for(c,business_id,body.actor_id),{"owner","manager","staff"})
        p=c.execute("SELECT * FROM products WHERE id=? AND business_id=?",(body.product_id,business_id)).fetchone()
        if not p: raise HTTPException(404,"Product not found")
        newq=p["quantity"]+body.delta
        if newq < 0: raise HTTPException(400,"Stock cannot become negative")
        ts=now()
        c.execute("UPDATE products SET quantity=?,updated_at=? WHERE id=?",(newq,ts,body.product_id))
        c.execute("INSERT INTO stock_movements VALUES(?,?,?,?,?,?,?)",(str(uuid.uuid4()),business_id,body.product_id,body.delta,body.reason,body.actor_id,ts))
        audit(c,business_id,"stock.changed","product",body.product_id,body.actor_id,{"delta":body.delta,"reason":body.reason,"new_quantity":newq})
        return {"product_id":body.product_id,"quantity":newq,"delta":body.delta}

@app.get("/api/businesses/{business_id}/summary")
def summary(business_id: str):
    with db() as c:
        get_business(c,business_id)
        count=c.execute("SELECT COUNT(*) n FROM products WHERE business_id=?",(business_id,)).fetchone()["n"]
        low=c.execute("SELECT * FROM products WHERE business_id=? AND quantity<=reorder_level ORDER BY quantity",(business_id,)).fetchall()
        qty=c.execute("SELECT COALESCE(SUM(quantity),0) q FROM products WHERE business_id=?",(business_id,)).fetchone()["q"]
        return {"product_count":count,"total_units":qty,"low_stock":[product_dict(x) for x in low]}

@app.post("/api/businesses/{business_id}/knowledge")
def add_knowledge(business_id: str, body: KnowledgeIn, actor_id: Optional[str] = None):
    with db() as c:
        require_role(role_for(c,business_id,actor_id),{"owner","manager"})
        kid=str(uuid.uuid4()); ts=now()
        c.execute("INSERT INTO knowledge VALUES(?,?,?,?,?,?,?)",(kid,business_id,body.title,body.body,body.tags,ts,ts))
        audit(c,business_id,"knowledge.created","knowledge",kid,actor_id,{"title":body.title})
        return {"id":kid,"status":"saved"}

@app.get("/api/businesses/{business_id}/knowledge")
def get_knowledge(business_id: str, q: str = ""):
    with db() as c:
        get_business(c,business_id)
        rows=c.execute("SELECT id,title,body,tags,updated_at FROM knowledge WHERE business_id=? AND (title LIKE ? OR body LIKE ? OR tags LIKE ?) ORDER BY updated_at DESC",
                       (business_id,f"%{q}%",f"%{q}%",f"%{q}%")).fetchall()
        return [dict(x) for x in rows]

def find_product(c,bid,query):
    rows=c.execute("SELECT * FROM products WHERE business_id=? ORDER BY name",(bid,)).fetchall()
    q=query.lower().strip()
    exact=[r for r in rows if r["name"].lower()==q or (r["sku"] and r["sku"].lower()==q)]
    if exact: return exact[0]
    matches=[r for r in rows if q in r["name"].lower() or r["name"].lower() in q]
    return matches[0] if len(matches)==1 else None

def interpret_command(c,bid,command,actor_id):
    """Deterministic starter agent. Replace/augment with a model provider behind this interface."""
    text=command.strip()
    low=text.lower()
    if any(x in low for x in ["low stock","stock low","khatam","kam stock","reorder"]):
        rows=c.execute("SELECT name,quantity,unit,reorder_level FROM products WHERE business_id=? AND quantity<=reorder_level ORDER BY quantity",(bid,)).fetchall()
        if not rows: return {"reply":"Abhi kisi item ka stock reorder level se neeche nahi hai.","type":"answer"}
        items=", ".join(f'{r["name"]}: {r["quantity"]} {r["unit"]} (reorder at {r["reorder_level"]})' for r in rows)
        return {"reply":"Low-stock items: "+items,"type":"answer"}
    m=re.search(r"(?:add|increase|jodo|badhao|bhar do)\s+([\\w .-]+?)\s+(?:by|se|ka)\s+(-?\\d+(?:\\.\\d+)?)",low)
    if not m:
        # natural Hinglish variants like "Maggi stock 5 badhao"
        m=re.search(r"([\\w .-]+?)\\s+(?:stock\\s+)?(\\d+(?:\\.\\d+)?)\\s+(?:add|badhao|jodo)",low)
    if m:
        pname=m.group(1).strip(); delta=float(m.group(2))
        p=find_product(c,bid,pname)
        if not p:
            return {"reply":f'"{pname}" ko uniquely match nahi kar paaya. Product list se select karein ya exact naam/SKU dein.',"type":"clarification"}
        action={"product_id":p["id"],"delta":delta,"reason":"AI command: "+text,"actor_id":actor_id}
        aid=str(uuid.uuid4())
        c.execute("INSERT INTO pending_actions VALUES(?,?,?,?,?,?,?)",(aid,bid,actor_id,"stock_change",json.dumps(action),"pending",now()))
        return {"reply":f'Confirm karein: {p["name"]} ka stock {p["quantity"]} se {p["quantity"]+delta} {p["unit"]} karna hai?',"type":"confirmation_required","pending_action_id":aid}
    if any(x in low for x in ["how many","kitna stock","stock of","stock mein","stock hai"]):
        p=find_product(c,bid,text)
        if p: return {"reply":f'{p["name"]}: {p["quantity"]} {p["unit"]}. Reorder level: {p["reorder_level"]}.',"type":"answer"}
    return {"reply":"Main abhi inventory aur store-knowledge commands handle karta hoon. Try: “low stock batao”, “Maggi stock 5 badhao”, ya exact product name ke saath stock poochhein. Ambiguous commands ko main execute nahi karta.","type":"help"}

@app.post("/api/agent/command")
def agent_command(body: CommandIn):
    with db() as c:
        get_business(c,body.business_id)
        role_for(c,body.business_id,body.actor_id)
        result=interpret_command(c,body.business_id,body.command,body.actor_id)
        audit(c,body.business_id,"agent.command","agent",None,body.actor_id,{"command":body.command,"result_type":result["type"]})
        return result

@app.post("/api/agent/actions/{action_id}/confirm")
def confirm_action(action_id: str, body: ConfirmIn):
    with db() as c:
        a=c.execute("SELECT * FROM pending_actions WHERE id=?",(action_id,)).fetchone()
        if not a: raise HTTPException(404,"Pending action not found")
        if a["status"]!="pending": raise HTTPException(409,"Action is no longer pending")
        require_role(role_for(c,a["business_id"],a["actor_id"]),{"owner","manager"})
        if not body.approve:
            c.execute("UPDATE pending_actions SET status='rejected' WHERE id=?",(action_id,))
            audit(c,a["business_id"],"agent.action.rejected","pending_action",action_id,a["actor_id"])
            return {"status":"rejected"}
        p=json.loads(a["payload_json"])
        prod=c.execute("SELECT * FROM products WHERE id=? AND business_id=?",(p["product_id"],a["business_id"])).fetchone()
        if not prod: raise HTTPException(404,"Product no longer exists")
        newq=prod["quantity"]+p["delta"]
        if newq<0: raise HTTPException(400,"Stock cannot become negative")
        ts=now()
        c.execute("UPDATE products SET quantity=?,updated_at=? WHERE id=?",(newq,ts,p["product_id"]))
        c.execute("INSERT INTO stock_movements VALUES(?,?,?,?,?,?,?)",(str(uuid.uuid4()),a["business_id"],p["product_id"],p["delta"],p["reason"],a["actor_id"],ts))
        c.execute("UPDATE pending_actions SET status='approved' WHERE id=?",(action_id,))
        audit(c,a["business_id"],"agent.action.approved","product",p["product_id"],a["actor_id"],{"delta":p["delta"],"new_quantity":newq})
        return {"status":"approved","quantity":newq}

@app.get("/api/businesses/{business_id}/audit")
def audit_history(business_id: str, limit: int = 100):
    with db() as c:
        get_business(c,business_id)
        rows=c.execute("SELECT * FROM audit_log WHERE business_id=? ORDER BY created_at DESC LIMIT ?",(business_id,min(max(limit,1),500))).fetchall()
        return [{**dict(r),"details":json.loads(r["details_json"])} for r in rows]

@app.post("/api/uploads")
async def upload(file: UploadFile = File(...)):
    data=await file.read(MAX_UPLOAD_BYTES+1)
    if len(data)>MAX_UPLOAD_BYTES: raise HTTPException(413,"File exceeds 8 MB limit")
    ext=os.path.splitext(file.filename or "")[1].lower()
    if ext not in {".png",".jpg",".jpeg",".webp",".pdf",".txt",".csv"}:
        raise HTTPException(415,"Supported files: PNG, JPG, WEBP, PDF, TXT, CSV")
    name=f"{uuid.uuid4()}{ext}"
    path=os.path.join("uploads",name)
    with open(path,"wb") as f: f.write(data)
    extracted=""
    if ext in {".txt",".csv"}:
        extracted=data.decode("utf-8",errors="replace")[:20000]
    elif ext in {".png",".jpg",".jpeg",".webp"}:
        try:
            import pytesseract
            from PIL import Image
            extracted=pytesseract.image_to_string(Image.open(path))[:20000]
        except Exception:
            extracted="OCR is not configured. Install Tesseract and the optional Pillow/pytesseract dependencies."
    elif ext==".pdf":
        try:
            from pypdf import PdfReader
            extracted="\n".join((p.extract_text() or "") for p in PdfReader(path).pages)[:20000]
        except Exception:
            extracted="PDF text extraction is not configured. Install pypdf."
    return {"filename":file.filename,"stored_name":name,"extracted_text":extracted,"note":"Extracted content is untrusted input; review before importing into live records."}

def verify_whatsapp_signature(raw: bytes, signature: Optional[str]):
    if not WA_APP_SECRET: return False
    if not signature or not signature.startswith("sha256="): return False
    expected=hmac.new(WA_APP_SECRET.encode(),raw,hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected,signature.split("=",1)[1])

@app.get("/webhooks/whatsapp")
def whatsapp_verify(request: Request):
    # Meta webhook subscription verification
    mode=request.query_params.get("hub.mode")
    token=request.query_params.get("hub.verify_token")
    challenge=request.query_params.get("hub.challenge")
    if mode=="subscribe" and WA_VERIFY_TOKEN and hmac.compare_digest(token or "",WA_VERIFY_TOKEN):
        return PlainTextResponse(challenge or "")
    raise HTTPException(403,"Webhook verification failed")

@app.post("/webhooks/whatsapp")
async def whatsapp_receive(request: Request, x_hub_signature_256: Optional[str] = Header(default=None)):
    raw=await request.body()
    if not verify_whatsapp_signature(raw,x_hub_signature_256):
        raise HTTPException(401,"Invalid webhook signature; configure WHATSAPP_APP_SECRET")
    payload=json.loads(raw.decode("utf-8"))
    # Deliberately acknowledge only. Map sender to a business via channel_links,
    # then route message through the same agent service after explicit onboarding.
    return JSONResponse({"received":True,"entries":len(payload.get("entry",[])),"routing":"not_configured","next_step":"Create channel_links mapping and configure outbound Cloud API."})

@app.post("/api/whatsapp/send")
async def whatsapp_send(request: Request):
    # Official Cloud API sender. Kept optional and disabled until credentials exist.
    if not (WA_ACCESS_TOKEN and WA_PHONE_NUMBER_ID):
        raise HTTPException(503,"WhatsApp Cloud API is not configured")
    body=await request.json()
    to=body.get("to"); message=body.get("message")
    if not to or not message: raise HTTPException(400,"to and message are required")
    import urllib.request
    url=f"https://graph.facebook.com/v21.0/{WA_PHONE_NUMBER_ID}/messages"
    payload=json.dumps({"messaging_product":"whatsapp","to":to,"type":"text","text":{"body":message}}).encode()
    req=urllib.request.Request(url,data=payload,headers={"Authorization":f"Bearer {WA_ACCESS_TOKEN}","Content-Type":"application/json"},method="POST")
    try:
        with urllib.request.urlopen(req,timeout=15) as res:
            return json.loads(res.read().decode())
    except Exception as e:
        raise HTTPException(502,f"WhatsApp provider request failed: {type(e).__name__}")


# Phase 1 Master Blueprint: Connect Extensions (Sales, Outbox, MCP Gateway, Compliance OS)
try:
    import extensions
    extensions.register_extensions(app, db, audit, get_business, DB_PATH)
except Exception as _e:
    print(f"Warning: Extensions could not be registered: {_e}")

# Superintelligence Shared AI Brain & Secure Business Backend Endpoints (/api/v1/ai/*)
try:
    import superintelligence
    superintelligence.register_superintelligence_routes(app, DB_PATH)
except Exception as _e:
    print(f"Warning: Superintelligence could not be registered: {_e}")

# Ecosystem Platform Modules (AI Studio, Growth CRM, QR Feedback, Safety & Verticals)
try:
    import platform_modules
    platform_modules.register_platform_routes(app)
except Exception as _e:
    print(f"Warning: Platform modules could not be registered: {_e}")

# Corporate Entity & Governance Endpoints (/api/v1/company/*)
try:
    import company_entity
    company_entity.init_company_db(DB_PATH)
    company_entity.register_company_routes(app, DB_PATH)
except Exception as _e:
    print(f"Warning: Company entity could not be registered: {_e}")

# DukaanMitra.in Platform, Public Verification, Access & WhatsApp AI Bot (/api/v1/public/*, /api/v1/access/*, /api/v1/whatsapp/*)
try:
    import dukaanmitra_platform
    dukaanmitra_platform.register_platform_integration_routes(app, DB_PATH)
except Exception as _e:
    print(f"Warning: DukaanMitra Platform could not be registered: {_e}")

# Mowglai Website Delivery Agent v0.1 Integration
try:
    import mowglai_delivery_agent
    mowglai_delivery_agent.register_mowglai_routes(app)
except Exception as _e:
    print(f"Warning: Mowglai Delivery Agent could not be registered: {_e}")
