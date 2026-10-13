"""
DukaanMitra AI Technologies Private Limited
Corporate Entity, Cap Table, Multi-Branch Franchise & Statutory Compliance Module
"""
import sqlite3, uuid, json, re
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()

def init_company_db(db_path: str):
    """Initializes corporate entity and governance tables."""
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.executescript("""
    CREATE TABLE IF NOT EXISTS company_profiles (
        id TEXT PRIMARY KEY,
        legal_name TEXT NOT NULL,
        trade_name TEXT NOT NULL,
        cin TEXT UNIQUE,
        gstin TEXT UNIQUE,
        pan TEXT,
        tan TEXT,
        udyam_registration TEXT UNIQUE,
        dpiit_recognition TEXT,
        registered_address TEXT,
        state TEXT,
        incorporation_date TEXT,
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cap_table (
        id TEXT PRIMARY KEY,
        company_id TEXT NOT NULL,
        shareholder_name TEXT NOT NULL,
        role TEXT NOT NULL, -- founder, investor, esop_pool
        shares_count INTEGER NOT NULL,
        equity_pct REAL NOT NULL,
        vesting_months INTEGER DEFAULT 48,
        cliff_months INTEGER DEFAULT 12,
        granted_at TEXT NOT NULL,
        FOREIGN KEY (company_id) REFERENCES company_profiles(id)
    );

    CREATE TABLE IF NOT EXISTS company_branches (
        id TEXT PRIMARY KEY,
        company_id TEXT NOT NULL,
        business_id TEXT NOT NULL,
        branch_name TEXT NOT NULL,
        branch_type TEXT DEFAULT 'retail_store', -- retail_store, warehouse, dark_store
        city TEXT NOT NULL,
        pincode TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (company_id) REFERENCES company_profiles(id),
        FOREIGN KEY (business_id) REFERENCES businesses(id)
    );

    CREATE TABLE IF NOT EXISTS statutory_compliance_tasks (
        id TEXT PRIMARY KEY,
        company_id TEXT NOT NULL,
        title TEXT NOT NULL,
        compliance_type TEXT NOT NULL, -- GST, TDS, ROC, ADVANCE_TAX, PF_ESIC
        due_date TEXT NOT NULL,
        status TEXT DEFAULT 'pending', -- pending, filed, overdue
        filed_at TEXT,
        acknowledgement_no TEXT,
        FOREIGN KEY (company_id) REFERENCES company_profiles(id)
    );
    """)
    conn.commit()
    conn.close()

class CompanyProfileRequest(BaseModel):
    legal_name: str = "DukaanMitra AI Technologies Private Limited"
    trade_name: str = "DukaanMitra OS"
    cin: Optional[str] = "U72900DL2026PTC998877"
    gstin: Optional[str] = "07AAAAA0000A1Z5"
    pan: Optional[str] = "AAAAA0000A"
    tan: Optional[str] = "DELA00000A"
    udyam_registration: Optional[str] = "UDYAM-DL-01-0012345"
    dpiit_recognition: Optional[str] = "DIPP98765"
    registered_address: str = "New Delhi, India"
    state: str = "Delhi"
    incorporation_date: Optional[str] = None

class CapTableEntry(BaseModel):
    shareholder_name: str
    role: str # founder, investor, esop_pool
    shares_count: int
    equity_pct: float
    vesting_months: int = 48
    cliff_months: int = 12

class CompanyService:
    @staticmethod
    def register_or_update_company(conn: sqlite3.Connection, req: CompanyProfileRequest) -> Dict[str, Any]:
        cur = conn.cursor()
        now_ts = utc_now()
        inc_date = req.incorporation_date or now_ts[:10]

        row = cur.execute("SELECT id FROM company_profiles WHERE trade_name=? OR legal_name=?",
                          (req.trade_name, req.legal_name)).fetchone()

        if row:
            cid = row[0]
            cur.execute("""
                UPDATE company_profiles SET
                    legal_name=?, trade_name=?, cin=?, gstin=?, pan=?, tan=?,
                    udyam_registration=?, dpiit_recognition=?, registered_address=?,
                    state=?, updated_at=?
                WHERE id=?
            """, (req.legal_name, req.trade_name, req.cin, req.gstin, req.pan, req.tan,
                  req.udyam_registration, req.dpiit_recognition, req.registered_address,
                  req.state, now_ts, cid))
        else:
            cid = f"comp_{uuid.uuid4().hex[:8]}"
            cur.execute("""
                INSERT INTO company_profiles VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (cid, req.legal_name, req.trade_name, req.cin, req.gstin, req.pan, req.tan,
                  req.udyam_registration, req.dpiit_recognition, req.registered_address,
                  req.state, inc_date, 'active', now_ts, now_ts))

            # Default Founding Cap Table if new company
            cur.executemany("""
                INSERT INTO cap_table VALUES (?,?,?,?,?,?,?,?,?)
            """, [
                (f"cap_{uuid.uuid4().hex[:6]}", cid, "Amit Sharma", "founder", 8500000, 85.0, 48, 12, now_ts),
                (f"cap_{uuid.uuid4().hex[:6]}", cid, "Employee Stock Option Pool (ESOP)", "esop_pool", 1500000, 15.0, 48, 0, now_ts)
            ])

            # Seed standard annual and quarterly statutory calendar
            cur.executemany("""
                INSERT INTO statutory_compliance_tasks (id, company_id, title, compliance_type, due_date, status)
                VALUES (?,?,?,?,?,?)
            """, [
                (f"stat_{uuid.uuid4().hex[:6]}", cid, "Monthly GSTR-1 Return", "GST", f"{now_ts[:7]}-11", "pending"),
                (f"stat_{uuid.uuid4().hex[:6]}", cid, "Monthly GSTR-3B Summary Return", "GST", f"{now_ts[:7]}-20", "pending"),
                (f"stat_{uuid.uuid4().hex[:6]}", cid, "Quarterly TDS Deposit (Challan 281)", "TDS", f"{now_ts[:7]}-07", "pending"),
                (f"stat_{uuid.uuid4().hex[:6]}", cid, "ROC Annual Return (AOC-4 & MGT-7)", "ROC", "2026-10-30", "pending")
            ])

        conn.commit()
        return CompanyService.get_company_profile(conn, cid)

    @staticmethod
    def get_company_profile(conn: sqlite3.Connection, company_id: Optional[str] = None) -> Dict[str, Any]:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        if company_id:
            c = cur.execute("SELECT * FROM company_profiles WHERE id=?", (company_id,)).fetchone()
        else:
            c = cur.execute("SELECT * FROM company_profiles ORDER BY created_at DESC LIMIT 1").fetchone()

        if not c:
            return {"error": "Company profile not found"}

        cid = c["id"]
        cap_rows = cur.execute("SELECT * FROM cap_table WHERE company_id=?", (cid,)).fetchall()
        branches = cur.execute("SELECT * FROM company_branches WHERE company_id=?", (cid,)).fetchall()
        stat_tasks = cur.execute("SELECT * FROM statutory_compliance_tasks WHERE company_id=?", (cid,)).fetchall()

        return {
            "company": dict(c),
            "cap_table": [dict(r) for r in cap_rows],
            "branches": [dict(b) for b in branches],
            "statutory_calendar": [dict(s) for s in stat_tasks]
        }

    @staticmethod
    def add_branch_outlet(conn: sqlite3.Connection, company_id: str, business_id: str, branch_name: str, city: str, pincode: str) -> Dict[str, Any]:
        bid = f"br_{uuid.uuid4().hex[:6]}"
        now_ts = utc_now()
        conn.execute("""
            INSERT INTO company_branches VALUES (?,?,?,?,?,?,?,?)
        """, (bid, company_id, business_id, branch_name, "retail_store", city, pincode, now_ts))
        conn.commit()
        return {"branch_id": bid, "branch_name": branch_name, "status": "active"}

def register_company_routes(app, db_path: str):
    from fastapi import HTTPException

    @app.post("/api/v1/company/profile")
    def api_create_or_update_company(req: CompanyProfileRequest):
        with sqlite3.connect(db_path) as conn:
            return CompanyService.register_or_update_company(conn, req)

    @app.get("/api/v1/company/profile")
    def api_get_company():
        with sqlite3.connect(db_path) as conn:
            res = CompanyService.get_company_profile(conn)
            if "error" in res:
                # Auto-initialize default company profile
                return CompanyService.register_or_update_company(conn, CompanyProfileRequest())
            return res

    @app.post("/api/v1/company/branches")
    def api_add_branch(company_id: str, business_id: str, branch_name: str, city: str, pincode: str):
        with sqlite3.connect(db_path) as conn:
            return CompanyService.add_branch_outlet(conn, company_id, business_id, branch_name, city, pincode)
