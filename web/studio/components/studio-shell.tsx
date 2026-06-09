"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavActive, studioNav } from "@/lib/navigation";

export function StudioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <aside
        className="flex w-[var(--sidebar-width)] shrink-0 flex-col border-r border-white/10 bg-[var(--color-surface)]"
        aria-label="Studio navigation"
      >
        <div className="border-b border-white/10 px-5 py-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            OpenMontage
          </p>
          <h1 className="text-lg font-semibold">Studio</h1>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Local operator cockpit
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {studioNav.map((section) => (
            <div key={section.title ?? "main"} className="mb-4 last:mb-0">
              {section.title ? (
                <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                  {section.title}
                </p>
              ) : null}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active = isNavActive(
                    pathname,
                    item.href,
                    item.match,
                  );
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors duration-200 ${
                          active
                            ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
                            : "text-[var(--color-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-white/10 bg-[var(--color-surface)]/60 px-6 py-4 backdrop-blur">
          <p className="text-sm text-[var(--color-muted)]">
            Phase 1 · localhost control plane
          </p>
        </header>
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
