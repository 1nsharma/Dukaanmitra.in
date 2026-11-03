"""
DukaanMitra AI Engineering Sandbox - Local Ollama Model Provider
Enables private offline development using open-weight models (e.g., Qwen 2.5 7B, Llama 3.2).
"""

import json
from typing import Dict, Any, List
import urllib.request
import urllib.error
from .base import BaseAIModel
from ..config import config

class OllamaModel(BaseAIModel):
    def __init__(self, base_url: str = config.OLLAMA_BASE_URL, model_name: str = config.OLLAMA_MODEL):
        self.base_url = base_url.rstrip("/")
        self.model_name = model_name

    def generate(self, prompt: str, system_instruction: str = "") -> str:
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "system": system_instruction,
            "stream": False
        }
        
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode("utf-8"))
                return result.get("response", "")
        except Exception as e:
            return f"[OLLAMA_FALLBACK] Error contacting Ollama ({self.base_url}): {str(e)}"

    def generate_recommendation(
        self,
        agent: str,
        question: str,
        evidence: List[Dict[str, Any]],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        sys_prompt = (
            f"You are the DukaanMitra '{agent}' retail intelligence agent in sandbox mode. "
            "Analyze the shop problem and output your reasoning concisely with action items. "
            "Never execute financial transactions directly."
        )
        user_prompt = f"Problem: {question}\nEvidence: {json.dumps(evidence)}\nContext: {json.dumps(context)}"
        raw_text = self.generate(user_prompt, sys_prompt)

        return {
            "agent": agent,
            "summary": f"Ollama ({self.model_name}) analysis completed for {agent}.",
            "recommendation": raw_text.strip(),
            "action_type": "RECOMMENDATION_ONLY",
            "structured_payload": {"model": self.model_name},
            "evidence": evidence,
            "confidence_score": 0.90
        }
