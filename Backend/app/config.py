from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Document Authoring API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = Field(min_length=32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str
    CORS_ORIGINS: str = (
        "http://localhost:5173,http://localhost:8080,"
        "https://draftly-o5wf.onrender.com"
    )
    
    # LLM Configuration
    LLM_PROVIDER: str = "ollama"  # Supported: 'gemini' or 'ollama'.
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-3.8-flash"

    OLLAMA_BASE_URL: str = "http://127.0.0.1:11434"
    OLLAMA_MODEL: str = "llama3.2"
    OLLAMA_REQUEST_TIMEOUT: int = 120  # seconds
    
    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="ignore")

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
