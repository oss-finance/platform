from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings and configuration."""
    
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "OSS Finance Platform"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    
    # Database settings (placeholder for future use)
    DATABASE_URL: str = "TODO: Add database URL"
    
    class Config:
        env_file = ".env"


settings = Settings() 