"""
DukaanMitra AI Engineering Sandbox - Configuration Module
"""

import os

class SandboxConfig:
    EXECUTION_MODE = os.getenv("EXECUTION_MODE", "sandbox")
    MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "mock").lower()  # mock | ollama | vertex
    MODEL_NAME = os.getenv("MODEL_NAME", "gemini-3.8-flash")
    
    # Local open-source AI (Ollama)
    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
    
    # Google Cloud Vertex AI
    GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT", "")
    GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "global")
    GOOGLE_GENAI_USE_ENTERPRISE = os.getenv("GOOGLE_GENAI_USE_ENTERPRISE", "True").lower() == "true"
    
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://dukaanmitra:sandbox_pass@localhost:5432/dukaanmitra_sandbox")
    
    # Security Guardrails
    DENY_BY_DEFAULT = True
    MAX_UNAPPROVED_SPENDING = 0  # Zero financial transaction without explicit human approval
    AUDIT_RETENTION_DAYS = 365

config = SandboxConfig()
