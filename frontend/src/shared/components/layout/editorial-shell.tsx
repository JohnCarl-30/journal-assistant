import { Bell } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";

import { MobileNavigation, NavigationRail } from "./navigation-rail";

type EditorialShellProps = {
  children: React.ReactNode;
  topBarLabel: string;
  topBarDescription?: string;
  topBarActions?: React.ReactNode;
};

export function EditorialShell({
  children,
  topBarLabel,
  topBarDescription,
  topBarActions,
}: EditorialShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <NavigationRail />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[rgba(24,51,45,0.06)] bg-[rgba(245,247,243,0.85)] backdrop-blur-xl">
            <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
              <div>
                <p className="eyebrow">{topBarLabel}</p>
                {topBarDescription ? (
                  <p className="mt-1 text-sm text-muted-foreground">{topBarDescription}</p>
                ) : null}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden items-center gap-2 md:flex">{topBarActions}</div>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-[var(--border)] bg-white/80 text-foreground hover:bg-white"
                >
                  <Bell className="size-4" />
                  <span className="sr-only">Notifications</span>
                </Button>

                <Avatar size="default" className="border border-[var(--border)] bg-white/80">
                  <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Alex Dela Cruz" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <MobileNavigation />
          </header>

          <main className="flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pt-8">
            <div className="mx-auto w-full max-w-[1280px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
