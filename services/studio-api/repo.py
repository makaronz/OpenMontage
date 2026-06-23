"""Resolve OpenMontage repository root for Studio API."""

from __future__ import annotations

import os
from pathlib import Path


def get_repo_root() -> Path:
    env = os.environ.get("OPENMONTAGE_REPO_ROOT", "").strip()
    if env:
        return Path(env).resolve()
    return Path(__file__).resolve().parents[2]


def repo_root() -> Path:
    """Alias for backward compatibility."""
    return get_repo_root()
