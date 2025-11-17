import { PageHeader } from '@/components/page-header';
import { ScheduleManager } from '@/components/schedule-manager';

export default function SchedulePage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="일정 관리"
        description="자연어를 사용하여 캘린더를 관리하세요."
      />
      <main className="flex-1 p-4 sm:p-6">
        <ScheduleManager />
      </main>
    </div>
  );
}
