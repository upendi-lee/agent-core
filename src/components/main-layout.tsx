import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
