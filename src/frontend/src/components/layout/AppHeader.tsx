import { Link } from "@tanstack/react-router";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/generated/vibeloc-logo-pin-pulse-transparent.dim_400x400.png"
            alt="VibeLoc"
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold leading-none text-foreground">
                VibeLoc
              </span>
              <span className="text-[10px] font-medium tracking-wide text-muted-foreground/60">
                by GJilani
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Goated neighbourhood
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
