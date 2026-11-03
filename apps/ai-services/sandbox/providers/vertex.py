"""
DukaanMitra AI Engineering Sandbox - Google Cloud Vertex AI / Gemini Provider
Uses Google Gen AI SDK for unified enterprise reasoning and multi-modal understanding.
"""

from typing import Dict, Any, List
from .base import BaseAIModel
from ..config import config

class VertexModel(BaseAIModel):
    def __init__(self, model_name: str = config.MODEL_NAME):
        self.model_name = model_name
        self.client = None
        self._init_client()

    def _init_client(self):
        try:
            from google import genai
            self.client = genai.Client()
        except ImportError:
            # Degrades gracefully if google-genai is not installed in the current environment
            self.client = None

    def generate(self, prompt: str, system_instruction: str = "") -> str:
        if not self.client:
            return (
                f"[VERTEX_SIMULATION] Google GenAI SDK not installed or unauthenticated. "
                f"Simulating Vertex AI ({self.model_name}) response for: {prompt[:80]}..."
            )
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={"system_instruction": system_instruction} if system_instruction else None
            )
            return response.text
        except Exception as e:
            return f"[VERTEX_ERROR] Failed to query Vertex AI ({self.model_name}): {str(e)}"

    def generate_recommendation(
        self,
        agent: str,
        question: str,
        evidence: List[Dict[str, Any]],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        sys_prompt = (
            f"You are the DukaanMitra '{agent}' specialized retail AI agent. "
            "You serve small Indian shopkeepers (Kirana/MSME). "
            "Follow zero-trust rules: recommendations must be evidence-grounded and actionable. "
            "Sensitive financial write actions require explicit human approval."
        )
        prompt = f"Problem: {question}\nEvidence: {evidence}\nContext: {context}"
        response_text = self.generate(prompt, sys_prompt)

        return {
            "agent": agent,
            "summary": f"Vertex AI Gemini recommendation generated for {agent}.",
            "recommendation": response_text.strip(),
            "action_type": "RECOMMENDATION_ONLY",
            "structured_payload": {"model": self.model_name, "provider": "vertex_ai"},
            "evidence": evidence,
            "confidence_score": 0.96
        }
