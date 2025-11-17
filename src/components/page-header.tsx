import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="hidden text-sm text-muted-foreground md:block">
            {description}
          </p>
        )}
      </div>
      <UserNav />
    </header>
  );
}
