import { Outlet } from "@tanstack/react-router";
import AppHeader from "./AppHeader";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 overflow-x-hidden pb-20">
        <Outlet />
      </main>
      <BottomNav />
      <footer className="pb-24 pt-2 text-center">
        <p className="text-[11px] text-muted-foreground/50 tracking-wide">
          VibeLoc by{" "}
          <span className="font-medium text-muted-foreground/70">GJilani</span>
        </p>
      </footer>
    </div>
  );
}
