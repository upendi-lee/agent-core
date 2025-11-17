import { PageHeader } from '@/components/page-header';
import { ScheduleManager } from '@/components/schedule-manager';

export default function SchedulePage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Schedule Management"
        description="Manage your calendar using natural language."
      />
      <main className="flex-1 p-4 sm:p-6">
        <ScheduleManager />
      </main>
    </div>
  );
}
