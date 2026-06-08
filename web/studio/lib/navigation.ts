import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Clapperboard,
  FolderKanban,
  Home,
  Layers,
  Library,
  Settings,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  match?: "exact" | "prefix";
};

export type NavSection = {
  title?: string;
  items: NavItem[];
};

export const studioNav: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/", icon: Home, match: "exact" },
      { label: "Capabilities", href: "/capabilities", icon: Sparkles },
      { label: "Setup", href: "/setup", icon: Wrench },
      { label: "Pipelines", href: "/pipelines", icon: Layers },
      { label: "Projects", href: "/projects", icon: FolderKanban },
      { label: "Produce", href: "/produce", icon: Clapperboard },
    ],
  },
  {
    title: "Libraries",
    items: [
      { label: "Characters", href: "/libraries/characters", icon: Library },
      { label: "Environments", href: "/libraries/environments", icon: Library },
      { label: "Styles", href: "/libraries/styles", icon: Library },
    ],
  },
  {
    title: "Output",
    items: [{ label: "Renders", href: "/renders", icon: Zap }],
  },
  {
    title: "Docs",
    items: [
      { label: "Overview", href: "/docs", icon: BookOpen, match: "exact" },
      { label: "Providers", href: "/docs/providers", icon: Settings },
    ],
  },
];

export function isNavActive(
  pathname: string,
  href: string,
  match: NavItem["match"] = "prefix",
): boolean {
  if (match === "exact") {
    return pathname === href;
  }
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
