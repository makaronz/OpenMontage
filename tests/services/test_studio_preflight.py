"""Studio API preflight parity — Phase 1 AC-1/AC-2."""

from __future__ import annotations

import sys
import time
from pathlib import Path

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[2]
STUDIO_API_ROOT = PROJECT_ROOT / "services" / "studio-api"

sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(STUDIO_API_ROOT))

from preflight import PreflightCache  # noqa: E402
from repo import get_repo_root  # noqa: E402


def _wait_ready(cache: PreflightCache, timeout_s: float = 600.0) -> None:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        if cache.status in ("ready", "error"):
            return
        time.sleep(0.5)
    pytest.fail(f"preflight warmup did not finish within {timeout_s}s")


@pytest.fixture(scope="module")
def warmed_preflight() -> PreflightCache:
    cache = PreflightCache()
    cache.start_warmup(get_repo_root())
    _wait_ready(cache)
    if cache.status != "ready" or cache.summary is None:
        pytest.fail(cache.error or "preflight warmup failed")
    return cache


def test_preflight_summary_matches_registry(warmed_preflight: PreflightCache) -> None:
    """AC-2: summary capabilities align with provider_menu_summary() shape."""
    from tools.tool_registry import registry

    registry.ensure_discovered()
    direct = registry.provider_menu_summary()
    cached = warmed_preflight.summary
    assert cached is not None
    assert set(cached.keys()) == set(direct.keys())
    assert cached["composition_runtimes"] == direct["composition_runtimes"]
    assert len(cached["capabilities"]) == len(direct["capabilities"])


def _provider_menu_tool_count(entries: list[dict]) -> int:
    """provider_menu() excludes selector routers; catalog includes them."""
    return sum(1 for item in entries if item.get("provider") != "selector")


def test_capability_families_match_catalog(warmed_preflight: PreflightCache) -> None:
    """AC-2: every summary family exists in capability_catalog() with valid counts."""
    catalog = warmed_preflight.capability_catalog(get_repo_root())
    summary_caps = {
        row["capability"]: row for row in (warmed_preflight.summary or {})["capabilities"]
    }
    catalog_keys = set(catalog.keys())
    assert set(summary_caps.keys()) == catalog_keys

    for cap, row in summary_caps.items():
        assert row["configured"] <= row["total"], cap
        assert _provider_menu_tool_count(catalog[cap]) == row["total"], cap


def test_composition_runtime_keys(warmed_preflight: PreflightCache) -> None:
    """AC-1: composition runtimes expose ffmpeg, remotion, hyperframes booleans."""
    runtimes = (warmed_preflight.summary or {})["composition_runtimes"]
    for engine in ("ffmpeg", "remotion", "hyperframes"):
        assert engine in runtimes
        assert isinstance(runtimes[engine], bool)
