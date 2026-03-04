import { Outlet } from '@tanstack/react-router';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 overflow-x-hidden pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
