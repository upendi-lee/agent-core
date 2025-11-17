'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import dynamic from 'next/dynamic';

const MainSidebar = dynamic(
  () => import('@/components/main-sidebar').then((mod) => mod.MainSidebar),
  {
    ssr: false,
  }
);

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
