import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import AppLayout from "./components/layout/AppLayout";
import DiscoverPage from "./pages/DiscoverPage";
import MatchesPage from "./pages/MatchesPage";
import NeighbourhoodListingsPage from "./pages/NeighbourhoodListingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import PostPage from "./pages/PostPage";
import ProfilePreferencesPage from "./pages/ProfilePreferencesPage";

const rootRoute = createRootRoute({
  component: AppLayout,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

const discoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DiscoverPage,
});

// Redirect /shortlist → /matches for backward compat
const shortlistRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shortlist",
  beforeLoad: () => {
    throw redirect({ to: "/matches" });
  },
});

const matchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/matches",
  component: MatchesPage,
});

const neighbourhoodListingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/matches/$neighbourhoodName",
  component: NeighbourhoodListingsPage,
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post",
  component: PostPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePreferencesPage,
});

const routeTree = rootRoute.addChildren([
  onboardingRoute,
  discoverRoute,
  shortlistRedirectRoute,
  matchesRoute,
  neighbourhoodListingsRoute,
  postRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
