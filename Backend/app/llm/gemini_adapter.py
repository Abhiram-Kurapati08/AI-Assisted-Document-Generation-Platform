import asyncio
from typing import Any

from google import genai
from google.genai import types

from ..config import settings
from .provider import LLMProvider


class GeminiAdapter(LLMProvider):
    """Adapter for Google's supported GenAI Python SDK."""

    def __init__(self) -> None:
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is required when LLM_PROVIDER=gemini")
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = settings.GEMINI_MODEL

    async def aclose(self) -> None:
        await asyncio.to_thread(self.client.close)

    @staticmethod
    def _config(max_tokens: int, temperature: float, **kwargs: Any) -> types.GenerateContentConfig:
        return types.GenerateContentConfig(
            max_output_tokens=max(1, min(max_tokens, 8192)),
            temperature=min(max(temperature, 0), 1),
            **kwargs,
        )

    async def generate_text(
        self,
        prompt: str,
        max_tokens: int = 1000,
        temperature: float = 0.7,
        **kwargs: Any,
    ) -> str:
        try:
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=self.model,
                contents=prompt,
                config=self._config(max_tokens, temperature, **kwargs),
            )
            return response.text or ""
        except Exception as exc:
            raise RuntimeError(f"Gemini generation failed: {exc}") from exc

    async def generate_chat_completion(
        self,
        messages: list[dict[str, str]],
        max_tokens: int = 1000,
        temperature: float = 0.7,
        **kwargs: Any,
    ) -> str:
        contents = []
        system_instructions = []
        for message in messages:
            role = message.get("role", "user")
            content = message.get("content", "")
            if role == "system":
                system_instructions.append(content)
            else:
                contents.append({
                    "role": "model" if role == "assistant" else "user",
                    "parts": [{"text": content}],
                })

        if system_instructions:
            kwargs["system_instruction"] = "\n\n".join(system_instructions)

        try:
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=self.model,
                contents=contents,
                config=self._config(max_tokens, temperature, **kwargs),
            )
            return response.text or ""
        except Exception as exc:
            raise RuntimeError(f"Gemini chat generation failed: {exc}") from exc
