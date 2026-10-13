"""
DukaanMitra Superintelligence � Shared AI Brain & Secure Business Backend
Implements:
1. Shared AI Brain: Intent Detection, Context Loading, Multilingual Parsing (Hindi, Hinglish, English), Guardrails.
2. Policy & Permissions: Token Verification, Shop Membership Enforcement, Role Restrictions.
3. Database Write Gateway & LedgerService: Atomic ledger + customer balance updates with idempotency.
4. Proposal Lifecycle (Level 3 Maker-Checker): Expiry, atomic lock, approval/rejection.
5. Production Endpoints (/api/v1/ai/* and /api/v1/health).
"""
import os, json, re, sqlite3, uuid, hmac, hashlib
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Request, HTTPException, Header, Depends
from pydantic import BaseModel, Field

def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()

def parse_iso(ts_str: str) -> datetime:
    return datetime.fromisoformat(ts_str)

# ==============================================================================
# 1. DATABASE SCHEMA INITIALIZATION FOR SUPERINTELLIGENCE
# ==============================================================================

def init_superintelligence_db(db_path: str):
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys=ON")
    with conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS customers(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, name TEXT NOT NULL,
          phone TEXT, current_balance REAL NOT NULL DEFAULT 0.0,
          created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
          FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        CREATE INDEX IF NOT EXISTS idx_customers_biz ON customers(business_id);

        CREATE TABLE IF NOT EXISTS ledger_entries(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, customer_id TEXT,
          entry_type TEXT NOT NULL CHECK(entry_type IN ('debit', 'credit')),
          amount REAL NOT NULL, notes TEXT, idempotency_key TEXT UNIQUE,
          created_at TEXT NOT NULL, created_by TEXT,
          FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        CREATE INDEX IF NOT EXISTS idx_ledger_biz ON ledger_entries(business_id);

        CREATE TABLE IF NOT EXISTS proposals(
          id TEXT PRIMARY KEY, business_id TEXT NOT NULL, actor_id TEXT NOT NULL,
          action_type TEXT NOT NULL, payload_json TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending_approval' CHECK(status IN ('pending_approval', 'approved', 'rejected', 'expired')),
          expires_at TEXT NOT NULL, created_at TEXT NOT NULL,
          resolved_at TEXT, resolved_by TEXT,
          FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        CREATE INDEX IF NOT EXISTS idx_proposals_biz ON proposals(business_id, status);

        CREATE TABLE IF NOT EXISTS auth_tokens(
          token TEXT PRIMARY KEY, user_id TEXT NOT NULL, business_id TEXT NOT NULL,
          role TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL,
          FOREIGN KEY(business_id) REFERENCES businesses(id)
        );
        """)
    conn.close()

# ==============================================================================
# 2. POLICY & PERMISSIONS (AUTHENTICATION & SHOP AUTHORIZATION)
# ==============================================================================


def verify_webhook_signature(raw_body: bytes, signature_header: Optional[str], app_secret: str) -> bool:
    """Verifies HMAC-SHA256 signature for incoming webhooks (e.g. Meta WhatsApp Cloud API)."""
    if not signature_header or not signature_header.startswith("sha256="):
        return False
    expected_sig = signature_header.split("sha256=", 1)[1].strip()
    computed = hmac.new(app_secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected_sig, computed)

class AuthContext:
    def __init__(self, user_id: str, business_id: str, role: str):
        self.user_id = user_id
        self.business_id = business_id
        self.role = role

class SecurityPolicyException(Exception):
    def __init__(self, code: int, message: str):
        super().__init__(message)
        self.code = code
        self.message = message

def verify_token(conn: sqlite3.Connection, auth_header: Optional[str]) -> AuthContext:
    """Verifies Bearer token, checks expiration and returns authenticated user context."""
    if not auth_header or not auth_header.startswith("Bearer "):
        raise SecurityPolicyException(401, "Invalid or missing Bearer token")
    token = auth_header.split(" ", 1)[1].strip()

    row = conn.execute("SELECT * FROM auth_tokens WHERE token=?", (token,)).fetchone()
    if not row:
        raise SecurityPolicyException(401, "Invalid or expired token")

    exp = parse_iso(row["expires_at"])
    if datetime.now(timezone.utc) > exp:
        raise SecurityPolicyException(401, "Token has expired")

    return AuthContext(user_id=row["user_id"], business_id=row["business_id"], role=row["role"])

def verify_shop_membership(conn: sqlite3.Connection, auth_ctx: AuthContext, requested_shop_id: Optional[str]) -> str:
    """
    P1 Hardening: Client cannot bypass authorization by just passing an arbitrary shopId.
    Verifies that the authenticated user is an active member of the requested shop.
    """
    target_shop = requested_shop_id or auth_ctx.business_id

    # Check database membership
    row = conn.execute("SELECT role FROM users WHERE business_id=? AND id=?", (target_shop, auth_ctx.user_id)).fetchone()
    if not row or target_shop != auth_ctx.business_id:
        raise SecurityPolicyException(403, f"Access denied: User is not authorized for shop '{target_shop}'")

    return target_shop

def require_role(auth_ctx: AuthContext, allowed_roles: set):
    if auth_ctx.role not in allowed_roles:
        raise SecurityPolicyException(403, f"Role '{auth_ctx.role}' is not authorized. Required: {allowed_roles}")

# ==============================================================================
# 3. DATABASE WRITE GATEWAY & LEDGER SERVICE
# ==============================================================================

class DatabaseWriteGateway:
    """
    Sole authoritative pathway for ledger and balance mutations.
    AI agents NEVER run direct SQL queries or bypass validation.
    """
    @staticmethod
    def record_ledger_entry(
        conn: sqlite3.Connection,
        business_id: str,
        customer_id: str,
        entry_type: str,
        amount: float,
        notes: str,
        actor_id: str,
        idempotency_key: Optional[str] = None
    ) -> Dict[str, Any]:
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")
        if entry_type not in ("debit", "credit"):
            raise ValueError("entry_type must be 'debit' or 'credit'")

        # Idempotency check
        if idempotency_key:
            existing = conn.execute(
                "SELECT * FROM ledger_entries WHERE business_id=? AND idempotency_key=?",
                (business_id, idempotency_key)
            ).fetchone()
            if existing:
                cust = conn.execute("SELECT * FROM customers WHERE id=?", (existing["customer_id"],)).fetchone()
                return {
                    "idempotent_replay": True,
                    "entry_id": existing["id"],
                    "amount": existing["amount"],
                    "entry_type": existing["entry_type"],
                    "current_balance": cust["current_balance"] if cust else 0.0
                }

        # Check customer existence
        cust = conn.execute("SELECT * FROM customers WHERE id=? AND business_id=?", (customer_id, business_id)).fetchone()
        if not cust:
            raise ValueError(f"Customer '{customer_id}' not found in business")

        ts = utc_now()
        entry_id = "ledg_" + str(uuid.uuid4())

        # Atomic calculation: debit increases udhaari (due), credit decreases udhaari (payment received)
        balance_delta = amount if entry_type == "debit" else -amount
        new_balance = round(cust["current_balance"] + balance_delta, 2)

        # Atomic commit
        conn.execute("UPDATE customers SET current_balance=?, updated_at=? WHERE id=?", (new_balance, ts, customer_id))
        conn.execute(
            "INSERT INTO ledger_entries (id, business_id, customer_id, entry_type, amount, notes, idempotency_key, created_at, created_by) VALUES(?,?,?,?,?,?,?,?,?)",
            (entry_id, business_id, customer_id, entry_type, amount, notes, idempotency_key, ts, actor_id)
        )
        conn.execute(
            "INSERT INTO audit_log VALUES(?,?,?,?,?,?,?,?)",
            (str(uuid.uuid4()), business_id, actor_id, f"ledger.{entry_type}", "ledger", entry_id,
             json.dumps({"amount": amount, "customer_id": customer_id, "new_balance": new_balance}, ensure_ascii=False), ts)
        )

        return {
            "idempotent_replay": False,
            "entry_id": entry_id,
            "amount": amount,
            "entry_type": entry_type,
            "current_balance": new_balance
        }

# ==============================================================================
# 4. SHARED AI BRAIN: INTENT DETECTION, CONTEXT & GUARDRAILS
# ==============================================================================

class Guardrails:
    """Enforces AI safety: prompt injection defense, ambiguous amount detection, output validation."""
    INJECTION_PATTERNS = [
        r"ignore\s+(all\s+)?(previous|standing)\s+instructions",
        r"grant\s+(me|user)\s+(admin|owner|root)\s+role",
        r"drop\s+table",
        r"delete\s+from",
        r"bypass\s+permissions",
        r"you\s+are\s+now\s+in\s+developer\s+mode"
    ]

    AMBIGUOUS_AMOUNT_WORDS = [
        "kuch", "thoda", "thode", "some", "few", "bahut", "kaafi", "andaaza", "approx", "around"
    ]

    @classmethod
    def check_prompt_injection(cls, text: str):
        low = text.lower()
        for pat in cls.INJECTION_PATTERNS:
            if re.search(pat, low):
                raise SecurityPolicyException(400, "Safety Alert: Prompt injection or unauthorized instruction override detected.")

    @classmethod
    def check_ambiguous_amount(cls, text: str) -> bool:
        low = text.lower()
        has_amount_word = any(w in low for w in cls.AMBIGUOUS_AMOUNT_WORDS)
        has_digits = bool(re.search(r"\d+", low))
        # If words like "kuch paise" are used without explicit digits -> ambiguous
        return has_amount_word and not has_digits

class SharedAIBrain:
    """
    Multi-channel intelligence brain handling Hindi, Hinglish and English commands.
    Reads live store context without hardcoding. Proposes actions for financial changes.
    """
    @staticmethod
    def find_customer_live(conn: sqlite3.Connection, business_id: str, query: str) -> Optional[Dict[str, Any]]:
        rows = conn.execute("SELECT * FROM customers WHERE business_id=?", (business_id,)).fetchall()
        q = query.lower().strip()
        for r in rows:
            if r["name"].lower() == q or (r["phone"] and r["phone"].strip() == q):
                return dict(r)
        # Substring match
        matches = [r for r in rows if q in r["name"].lower()]
        return dict(matches[0]) if len(matches) == 1 else None

    @staticmethod
    def process_command(
        conn: sqlite3.Connection,
        business_id: str,
        actor_id: str,
        message: str,
        locale: str = "hi-IN",
        channel: str = "web"
    ) -> Dict[str, Any]:
        Guardrails.check_prompt_injection(message)

        if Guardrails.check_ambiguous_amount(message):
            return {
                "type": "clarification_needed",
                "message": "Kripya nishchit rashi (exact amount) batayein. Udhaaran ke liye: 'Ramesh ka ?500 udhaari likho'.",
                "locale": locale
            }

        low = message.lower().strip()

        # 1. Total Sales Query ("Aaj ki total sales batao", "today sales", "sales report")
        if any(x in low for x in ["sales batao", "total sale", "today's sale", "kitni bikri hui", "aaj ki bikri"]):
            rows = conn.execute("SELECT SUM(total_amount) as total, COUNT(*) as count FROM sales WHERE business_id=?", (business_id,)).fetchone()
            total = rows["total"] or 0.0
            count = rows["count"] or 0
            return {
                "type": "answer",
                "message": f"Dukaan ki kul sales ₹{total:,.2f} hai ({count} transactions).",
                "data": {"total_sales": total, "transaction_count": count},
                "locale": locale
            }

        # 2. Financial Proposal: Credit / Udhaari ("Ramesh ki 500 udhaari likho", "Add 500 debt for Ramesh", "Ramesh udhari 500")
        m_debit = re.search(r"([\w\s]+?)(?:\s+ki|\s+ka|\s+ko)?\s+(?:rs\.?|inr|\u20b9|rs\.?|rupees)?\s*(\d+(?:\.\d+)?)\s*(?:rs\.?|inr|\u20b9|rupees)?\s*(?:udhaari|udhari|debt|baaki|likho|jama)", low)
        if not m_debit:
            m_debit = re.search(r"(?:udhaari|udhari|debt)\s+(?:of\s+)?(?:rs\.?|inr|\u20b9|rs\.?|rupees)?\s*(\d+(?:\.\d+)?)\s*(?:for|to|ka)?\s*([\w\s]+)", low)
            if m_debit:
                # swapped
                amount_str = m_debit.group(1)
                cname = m_debit.group(2).strip()
            else:
                cname = None
                amount_str = None
        else:
            cname = m_debit.group(1).strip()
            amount_str = m_debit.group(2)

        if cname and amount_str:
            amount = float(amount_str)
            cust = SharedAIBrain.find_customer_live(conn, business_id, cname)
            if not cust:
                return {
                    "type": "customer_not_found",
                    "message": f"Grahak '{cname}' records mein nahi mila. Naya customer add karein ya exact naam check karein.",
                    "locale": locale
                }

            # Level 3: AI creates a structured proposal requiring Owner/Manager approval
            proposal_id = "prop_" + str(uuid.uuid4())
            ts = utc_now()
            expires_at = (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()
            payload = {
                "action": "record_ledger_entry",
                "customer_id": cust["id"],
                "customer_name": cust["name"],
                "entry_type": "debit",
                "amount": amount,
                "notes": f"AI command: {message}"
            }

            conn.execute(
                "INSERT INTO proposals VALUES(?,?,?,?,?,?,?,?,?,?)",
                (proposal_id, business_id, actor_id, "ledger.debit", json.dumps(payload),
                 "pending_approval", expires_at, ts, None, None)
            )

            return {
                "type": "proposal_created",
                "proposal_id": proposal_id,
                "requires_approval": True,
                "message": f"Prastav tayyar hai: {cust['name']} ke khate mein ₹{amount:.2f} udhaari darj karne ke liye approval chahiye.",
                "proposal": {
                    "id": proposal_id,
                    "customer_name": cust["name"],
                    "amount": amount,
                    "current_balance": cust["current_balance"],
                    "new_balance": cust["current_balance"] + amount,
                    "expires_at": expires_at
                },
                "locale": locale
            }

        # 3. Customer Balance Check ("Ramesh ka balance kitna hai", "how much balance does Ramesh have")
        if any(w in low for w in ["balance", "khata", "hisab"]):
            words = low.replace("ka", "").replace("balance", "").replace("kitna", "").replace("hai", "").replace("batao", "").strip()
            if words:
                cust = SharedAIBrain.find_customer_live(conn, business_id, words)
                if cust:
                    return {
                        "type": "answer",
                        "message": f"{cust['name']} ka vartaman khata balance: ₹{cust['current_balance']:,.2f}.",
                        "data": cust,
                        "locale": locale
                    }

        return {
            "type": "fallback",
            "message": "Aapka aadesh samajh nahi aaya. Try karein: 'Aaj ki total sales batao', 'Ramesh ka 500 udhaari likho', ya kisi grahak ka balance poochhein.",
            "locale": locale
        }

# ==============================================================================
# 5. PROPOSAL LIFECYCLE & MAKER-CHECKER ENGINE
# ==============================================================================

class ProposalEngine:
    @staticmethod
    def approve(conn: sqlite3.Connection, proposal_id: str, approver_ctx: AuthContext) -> Dict[str, Any]:
        require_role(approver_ctx, {"owner", "manager"})
        # AI/system cannot self-approve high-risk actions
        if approver_ctx.role in ("bot", "ai", "system"):
            raise SecurityPolicyException(403, "Security Policy Violation: System or AI bot role cannot approve proposals")


        # Fetch proposal
        p = conn.execute("SELECT * FROM proposals WHERE id=?", (proposal_id,)).fetchone()
        if not p:
            raise SecurityPolicyException(404, "Proposal not found")

        # Tenant isolation
        if p["business_id"] != approver_ctx.business_id:
            raise SecurityPolicyException(403, "Access denied: Proposal belongs to another shop")

        # Expiry check
        if datetime.now(timezone.utc) > parse_iso(p["expires_at"]):
            conn.execute("UPDATE proposals SET status='expired' WHERE id=?", (proposal_id,))
            raise SecurityPolicyException(400, "Proposal has expired and cannot be approved")

        # Atomic concurrency lock: status must be 'pending_approval'
        cur = conn.cursor()
        cur.execute(
            "UPDATE proposals SET status='approved', resolved_at=?, resolved_by=? WHERE id=? AND status='pending_approval'",
            (utc_now(), approver_ctx.user_id, proposal_id)
        )
        if cur.rowcount == 0:
            raise SecurityPolicyException(409, "Conflict: Proposal has already been resolved or processed concurrently")

        # Execute write through DatabaseWriteGateway
        payload = json.loads(p["payload_json"])
        if payload.get("action") == "record_ledger_entry":
            result = DatabaseWriteGateway.record_ledger_entry(
                conn=conn,
                business_id=p["business_id"],
                customer_id=payload["customer_id"],
                entry_type=payload["entry_type"],
                amount=payload["amount"],
                notes=payload.get("notes", "Approved via proposal"),
                actor_id=approver_ctx.user_id,
                idempotency_key=f"prop_{proposal_id}"
            )
            return {
                "success": True,
                "proposal_id": proposal_id,
                "status": "approved",
                "execution_result": result
            }

        return {"success": True, "proposal_id": proposal_id, "status": "approved"}

    @staticmethod
    def reject(conn: sqlite3.Connection, proposal_id: str, actor_ctx: AuthContext, reason: str = "User rejected") -> Dict[str, Any]:
        require_role(actor_ctx, {"owner", "manager"})

        p = conn.execute("SELECT * FROM proposals WHERE id=?", (proposal_id,)).fetchone()
        if not p:
            raise SecurityPolicyException(404, "Proposal not found")

        if p["business_id"] != actor_ctx.business_id:
            raise SecurityPolicyException(403, "Access denied: Proposal belongs to another shop")

        if p["status"] != "pending_approval":
            raise SecurityPolicyException(409, f"Proposal is already {p['status']}")

        ts = utc_now()
        conn.execute(
            "UPDATE proposals SET status='rejected', resolved_at=?, resolved_by=? WHERE id=?",
            (ts, actor_ctx.user_id, proposal_id)
        )
        conn.execute(
            "INSERT INTO audit_log VALUES(?,?,?,?,?,?,?,?)",
            (str(uuid.uuid4()), p["business_id"], actor_ctx.user_id, "proposal.rejected", "proposal",
             proposal_id, json.dumps({"reason": reason}, ensure_ascii=False), ts)
        )
        return {"success": True, "proposal_id": proposal_id, "status": "rejected"}

# ==============================================================================
# 6. FASTAPI PRODUCTION ROUTE REGISTRATION (/api/v1/ai/*)
# ==============================================================================

class AiCommandIn(BaseModel):
    message: str = Field(min_length=1)
    locale: str = "hi-IN"
    channel: str = "web"
    shopId: Optional[str] = None

class ProposalRejectIn(BaseModel):
    reason: Optional[str] = "Rejected by authorized manager"

def register_superintelligence_routes(app: FastAPI, db_path: str):
    init_superintelligence_db(db_path)

    def get_conn():
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys=ON")
        return conn

    # 1. Health Endpoint (Minimal check, no secrets exposed)
    @app.get("/api/v1/health")
    def superintelligence_health():
        return {
            "status": "healthy",
            "service": "dukaanmitra-superintelligence",
            "version": "1.0.0",
            "timestamp": utc_now()
        }

    # 2. Shared AI Command Endpoint
    @app.post("/api/v1/ai/command")
    def execute_command(body: AiCommandIn, authorization: Optional[str] = Header(default=None)):
        with get_conn() as conn:
            try:
                auth_ctx = verify_token(conn, authorization)
                target_shop = verify_shop_membership(conn, auth_ctx, body.shopId)
                res = SharedAIBrain.process_command(
                    conn=conn,
                    business_id=target_shop,
                    actor_id=auth_ctx.user_id,
                    message=body.message,
                    locale=body.locale,
                    channel=body.channel
                )
                conn.commit()
                return res
            except SecurityPolicyException as spe:
                raise HTTPException(status_code=spe.code, detail=spe.message)

    # 3. Pending Proposals List
    @app.get("/api/v1/ai/proposals")
    def list_proposals(shopId: Optional[str] = None, authorization: Optional[str] = Header(default=None)):
        with get_conn() as conn:
            try:
                auth_ctx = verify_token(conn, authorization)
                target_shop = verify_shop_membership(conn, auth_ctx, shopId)
                rows = conn.execute(
                    "SELECT * FROM proposals WHERE business_id=? AND status='pending_approval' ORDER BY created_at DESC",
                    (target_shop,)
                ).fetchall()
                result = []
                for r in rows:
                    result.append({
                        "id": r["id"],
                        "business_id": r["business_id"],
                        "actor_id": r["actor_id"],
                        "action_type": r["action_type"],
                        "payload": json.loads(r["payload_json"]),
                        "status": r["status"],
                        "expires_at": r["expires_at"],
                        "created_at": r["created_at"]
                    })
                return {"proposals": result}
            except SecurityPolicyException as spe:
                raise HTTPException(status_code=spe.code, detail=spe.message)

    # 4. Proposal Approval Endpoint
    @app.post("/api/v1/ai/proposals/{proposal_id}/approve")
    def approve_proposal(proposal_id: str, authorization: Optional[str] = Header(default=None)):
        with get_conn() as conn:
            try:
                auth_ctx = verify_token(conn, authorization)
                res = ProposalEngine.approve(conn, proposal_id, auth_ctx)
                conn.commit()
                return res
            except SecurityPolicyException as spe:
                raise HTTPException(status_code=spe.code, detail=spe.message)

    # 5. Proposal Rejection Endpoint
    @app.post("/api/v1/ai/proposals/{proposal_id}/reject")
    def reject_proposal(proposal_id: str, body: Optional[ProposalRejectIn] = None, authorization: Optional[str] = Header(default=None)):
        with get_conn() as conn:
            try:
                auth_ctx = verify_token(conn, authorization)
                reason = body.reason if body else "Rejected by user"
                res = ProposalEngine.reject(conn, proposal_id, auth_ctx, reason=reason)
                conn.commit()
                return res
            except SecurityPolicyException as spe:
                raise HTTPException(status_code=spe.code, detail=spe.message)
