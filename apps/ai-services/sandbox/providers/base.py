"""
DukaanMitra AI Engineering Sandbox - Abstract AI Provider Interface
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseAIModel(ABC):
    @abstractmethod
    def generate(self, prompt: str, system_instruction: str = "") -> str:
        """Generates plain text response from the underlying model."""
        pass

    @abstractmethod
    def generate_recommendation(
        self,
        agent: str,
        question: str,
        evidence: List[Dict[str, Any]],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generates structured recommendation adhering to DukaanMitra schema."""
        pass
