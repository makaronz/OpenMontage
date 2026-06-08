"""OpenMontage Studio API — Phase 0 control plane."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from preflight import PreflightCache
from repo import get_repo_root

preflight_cache = PreflightCache()


@asynccontextmanager
async def lifespan(app: FastAPI):
    repo_root = get_repo_root()
    app.state.repo_root = repo_root
    app.state.preflight = preflight_cache
    preflight_cache.start_warmup(repo_root)
    yield


app = FastAPI(title="OpenMontage Studio API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/preflight/summary")
def preflight_summary() -> dict:
    """Cached provider menu rollup; warms on API startup in a background thread."""
    return preflight_cache.as_response()
