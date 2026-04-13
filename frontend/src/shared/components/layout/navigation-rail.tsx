"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  ClipboardCheck,
  FilePenLine,
  LayoutGrid,
  NotebookPen,
  Sparkles,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DASHBOARD_ROUTE,
  EVALUATION_ROUTE,
  REPORT_ROUTE,
  TODAY_LOG_ROUTE,
  WEEKLY_ROUTE,
} from "@/shared/lib/routes";
import { cn } from "@/shared/lib/utils";

const navigationItems = [
  {
    href: DASHBOARD_ROUTE,
    label: "Dashboard",
    icon: LayoutGrid,
    match: "/dashboard",
  },
  {
    href: TODAY_LOG_ROUTE,
    label: "Daily Log",
    icon: NotebookPen,
    match: "/journal",
  },
  {
    href: WEEKLY_ROUTE,
    label: "Weekly Summaries",
    icon: BookOpenText,
    match: "/weeks",
  },
  {
    href: REPORT_ROUTE,
    label: "Final Report",
    icon: FilePenLine,
    match: "/report",
  },
  {
    href: EVALUATION_ROUTE,
    label: "Evaluation Prep",
    icon: ClipboardCheck,
    match: "/evaluation-prep",
  },
];

function matchesPath(pathname: string, href: string, match: string) {
  if (href === DASHBOARD_ROUTE) {
    return pathname === "/" || pathname === DASHBOARD_ROUTE;
  }

  return pathname.startsWith(match);
}

export function NavigationRail() {
  const pathname = usePathname();

  return (
    <aside className="shell-grid sticky top-0 hidden h-screen w-[248px] shrink-0 border-r border-sidebar-border lg:flex lg:flex-col">
      <div className="flex h-full flex-col px-6 py-7">
        <div className="animate-slide-right border-b border-[var(--line-strong)] pb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--foreground)]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">OJT Journal</p>
              <p className="text-sm text-muted-foreground">Work journal studio</p>
            </div>
          </div>

          <p className="mt-4 max-w-[180px] text-sm leading-6 text-muted-foreground">
            Keep logs, summaries, and the final report aligned in one writing space.
          </p>
        </div>

        <nav className="mt-7 space-y-1">
          {navigationItems.map((item, index) => {
            const active = matchesPath(pathname, item.href, item.match);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "animate-slide-right hover-tint flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium",
                  active
                    ? "border-[rgba(87,195,174,0.42)] bg-[var(--accent-soft)] text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto animate-slide-right border-t border-[var(--line-strong)] pt-6 [animation-delay:220ms]">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Alex Dela Cruz" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">Alex Dela Cruz</p>
              <p className="text-xs text-muted-foreground">CS intern · 142 / 300 hrs</p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <p className="eyebrow">Current focus</p>
            <p className="text-sm leading-6 text-foreground">
              Finish the current weekly draft, then prepare the supervisor evaluation talking
              points before export.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <div className="border-t border-[var(--line-strong)] px-4 py-3 lg:hidden">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {navigationItems.map((item) => {
          const active = matchesPath(pathname, item.href, item.match);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-[rgba(87,195,174,0.42)] bg-[var(--accent-soft)] text-foreground"
                  : "border-[var(--border)] bg-white/75 text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
