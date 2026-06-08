"""Background warmup and cache for tool-registry preflight summary."""

from __future__ import annotations

import sys
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass
class PreflightCache:
    """Thread-safe cache populated by a one-shot background discover()."""

    status: str = "warming"
    summary: dict[str, Any] | None = None
    error: str | None = None
    started_at: float = field(default_factory=time.time)
    ready_at: float | None = None
    _lock: threading.Lock = field(default_factory=threading.Lock, repr=False)
    _thread: threading.Thread | None = field(default=None, repr=False)

    def start_warmup(self, repo_root: Path) -> None:
        if self._thread is not None and self._thread.is_alive():
            return

        def _run() -> None:
            try:
                root = str(repo_root)
                if root not in sys.path:
                    sys.path.insert(0, root)

                from tools.tool_registry import registry

                registry.discover()
                summary = registry.provider_menu_summary()
                with self._lock:
                    self.summary = summary
                    self.status = "ready"
                    self.ready_at = time.time()
                    self.error = None
            except Exception as exc:  # noqa: BLE001 — surface to API client
                with self._lock:
                    self.status = "error"
                    self.error = str(exc)
                    self.summary = None

        self._thread = threading.Thread(
            target=_run,
            name="studio-preflight-warmup",
            daemon=True,
        )
        self._thread.start()

    def as_response(self) -> dict[str, Any]:
        with self._lock:
            elapsed_ms = int((time.time() - self.started_at) * 1000)
            payload: dict[str, Any] = {
                "status": self.status,
                "elapsed_ms": elapsed_ms,
            }
            if self.status == "ready" and self.summary is not None:
                payload["summary"] = self.summary
                if self.ready_at is not None:
                    payload["warmup_ms"] = int((self.ready_at - self.started_at) * 1000)
            elif self.status == "error":
                payload["error"] = self.error or "Preflight warmup failed"
            return payload
