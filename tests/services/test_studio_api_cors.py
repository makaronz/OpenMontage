"""Studio API CORS configuration for deployed Studio frontends."""

from __future__ import annotations

import importlib
import sys
from pathlib import Path

from fastapi.testclient import TestClient

PROJECT_ROOT = Path(__file__).resolve().parents[2]
STUDIO_API_ROOT = PROJECT_ROOT / "services" / "studio-api"

sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(STUDIO_API_ROOT))


def _load_main_with_env(monkeypatch, allowed_origins: str):
    monkeypatch.setenv("STUDIO_ALLOWED_ORIGINS", allowed_origins)
    sys.modules.pop("main", None)
    return importlib.import_module("main")


def test_cors_allows_configured_public_studio_origin(monkeypatch) -> None:
    origin = "https://openmontage-studio.example"
    main = _load_main_with_env(monkeypatch, origin)

    response = TestClient(main.app).options(
        "/api/health",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin


def test_cors_allows_configured_public_studio_origin_regex(monkeypatch) -> None:
    origin = "https://openmontage-studio.onrender.com"
    monkeypatch.delenv("STUDIO_ALLOWED_ORIGINS", raising=False)
    monkeypatch.setenv("STUDIO_ALLOWED_ORIGIN_REGEX", r"https://.*\.onrender\.com")
    sys.modules.pop("main", None)
    main = importlib.import_module("main")

    response = TestClient(main.app).options(
        "/api/health",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin
