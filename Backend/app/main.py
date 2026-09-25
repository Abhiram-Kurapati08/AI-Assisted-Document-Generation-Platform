from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .routers import auth, projects, sections, refine, export
from .config import settings
from .llm.provider import get_llm_provider


@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield
    try:
        provider = get_llm_provider()
    except Exception:
        return
    close = getattr(provider, "aclose", None)
    if close is not None:
        await close()

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Assisted Document Authoring and Generation Platform API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Include routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(sections.router)
app.include_router(refine.router)
app.include_router(export.router)

# Health check endpoint
@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """Health check endpoint for load balancers and monitoring."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

# Root endpoint
@app.get("/", status_code=status.HTTP_200_OK)
async def root():
    """Root endpoint with API information."""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "version": settings.VERSION,
        "docs": "/docs",
        "redoc": "/redoc"
    }
