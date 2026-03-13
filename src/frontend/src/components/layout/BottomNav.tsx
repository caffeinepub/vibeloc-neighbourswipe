import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Heart, Home, PlusSquare, Shield, User } from "lucide-react";
import { useIsAdmin } from "../../hooks/useAdmin";

export default function BottomNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { isAdmin } = useIsAdmin();

  const navItems = [
    {
      path: "/onboarding",
      icon: Compass,
      label: "Start",
      ocid: "nav.start_link",
    },
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
        {navItems.map((item) => {
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
