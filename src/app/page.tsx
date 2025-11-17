import { PageHeader } from '@/components/page-header';
import { ChatInterface } from '@/components/dashboard/chat-interface';
import { DailyBriefing } from '@/components/dashboard/daily-briefing';
import { UpcomingSchedule } from '@/components/dashboard/upcoming-schedule';
import { SuggestionCard } from '@/components/dashboard/suggestion-card';

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="대시보드"
        description="에이전트 코어에 오신 것을 환영합니다. 오늘의 개요입니다."
      />
      <main className="grid flex-1 gap-6 p-4 sm:p-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
          <ChatInterface />
        </div>
        <div className="flex flex-col gap-6">
          <DailyBriefing />
          <UpcomingSchedule />
          <SuggestionCard />
        </div>
      </main>
    </div>
  );
}
