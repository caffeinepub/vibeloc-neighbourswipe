import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Home, PlusSquare, Shield, User, Zap } from "lucide-react";
import type { PulsePost } from "../../backend";
import { useActor } from "../../hooks/useActor";
import { useIsAdmin } from "../../hooks/useAdmin";
import { useShortlist } from "../../hooks/useShortlist";

function usePulsesCount() {
  const { shortlist } = useShortlist();
  const { actor, isFetching } = useActor();
  const shortlistNames = new Set(shortlist.map((n) => n.name));

  const { data: allPulses = [] } = useQuery<PulsePost[]>({
    queryKey: ["pulses", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPulses();
    },
    enabled: !!actor && !isFetching && shortlist.length > 0,
  });

  return allPulses.filter((p) => shortlistNames.has(p.neighbourhood)).length;
}

export default function BottomNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { isAdmin } = useIsAdmin();
  const pulsesCount = usePulsesCount();
  const hasPulses = pulsesCount > 0;
  const isOnPulses = currentPath.startsWith("/pulses");

  const navItems = [
    { path: "/", icon: Home, label: "Discover", ocid: "nav.discover_link" },
    {
      path: "/matches",
      icon: Heart,
      label: "Matches",
      ocid: "nav.matches_link",
    },
    { path: "/post", icon: PlusSquare, label: "Post", ocid: "nav.post_link" },
    {
      path: "/profile",
      icon: User,
      label: "Profile",
      ocid: "nav.profile_link",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {/* Discover */}
        {navItems.slice(0, 3).map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/"
              ? currentPath === "/"
              : currentPath.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              data-ocid={item.ocid}
              className={`flex flex-col items-center gap-1 px-2 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Pulses tab with dot badge */}
        <Link
          to="/pulses"
          data-ocid="nav.pulses_link"
          className={`relative flex flex-col items-center gap-1 px-2 transition-colors ${
            isOnPulses
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="relative">
            <Zap
              className={`h-5 w-5 transition-all ${
                hasPulses && !isOnPulses
                  ? "drop-shadow-[0_0_4px_var(--primary)]"
                  : ""
              }`}
            />
            {hasPulses && !isOnPulses && (
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
          <span className="text-xs font-medium">Pulses</span>
        </Link>

        {/* Profile */}
        {navItems.slice(3).map((item) => {
          const Icon = item.icon;
          const isActive = currentPath.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              data-ocid={item.ocid}
              className={`flex flex-col items-center gap-1 px-2 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Admin tab — only visible to admins */}
        {isAdmin && (
          <Link
            to="/admin"
            data-ocid="nav.admin_link"
            className={`flex flex-col items-center gap-1 px-2 transition-colors ${
              currentPath.startsWith("/admin")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="h-5 w-5" />
            <span className="text-xs font-medium">Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
