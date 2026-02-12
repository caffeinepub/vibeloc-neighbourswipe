import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import AppLayout from './components/layout/AppLayout';
import OnboardingPage from './pages/OnboardingPage';
import DiscoverPage from './pages/DiscoverPage';
import ShortlistPage from './pages/ShortlistPage';
import ProfilePreferencesPage from './pages/ProfilePreferencesPage';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingPage,
});

const discoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DiscoverPage,
});

const shortlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shortlist',
  component: ShortlistPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePreferencesPage,
});

const routeTree = rootRoute.addChildren([
  onboardingRoute,
  discoverRoute,
  shortlistRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
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
