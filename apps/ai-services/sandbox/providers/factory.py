"""
DukaanMitra AI Engineering Sandbox - Model Provider Factory
Decouples business orchestration from the underlying AI model.
"""

from .base import BaseAIModel
from .mock import MockModel
from .ollama import OllamaModel
from .vertex import VertexModel
from ..config import config

def get_model(provider: str = None) -> BaseAIModel:
    selected_provider = (provider or config.MODEL_PROVIDER).lower()
    
    if selected_provider == "ollama":
        return OllamaModel()
    elif selected_provider == "vertex":
        return VertexModel()
    else:
        # Default zero-dependency mock model
        return MockModel()
