'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { ChatInterface } from '@/components/dashboard/chat-interface';
import { DailyBriefing } from '@/components/dashboard/daily-briefing';
import { UpcomingSchedule } from '@/components/dashboard/upcoming-schedule';
import { SuggestionCard } from '@/components/dashboard/suggestion-card';
import { IconNav } from '@/components/dashboard/icon-nav';
import { TodoList } from '@/components/todo-list';
import { NoteTaker } from '@/components/note-taker';
import { MeetingSummarizer } from '@/components/meeting-summarizer';
import { CalendarView } from '@/components/dashboard/calendar-view';
import { ScheduleManager } from '@/components/schedule-manager';

type View = 'SCHEDULE' | 'NOTES' | 'TASKS' | 'MEETINGS' | 'BRIEFING';

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<View>('SCHEDULE');

  const renderContent = () => {
    switch (activeView) {
      case 'SCHEDULE':
        return (
          <div className="space-y-6">
            <UpcomingSchedule />
            <CalendarView />
            <ScheduleManager />
          </div>
        );
      case 'NOTES':
        return <NoteTaker />;
      case 'TASKS':
        return <TodoList />;
      case 'MEETINGS':
        return <MeetingSummarizer />;
      case 'BRIEFING':
        return <DailyBriefing />;
      default:
        return <UpcomingSchedule />;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="대시보드"
        description="에이전트 코어에 오신 것을 환영합니다. 오늘의 개요입니다."
      />
      <main className="flex-1 space-y-6 p-4 sm:p-6">
        {/* 상단 1: 커맨드창 */}
        <ChatInterface />

        {/* 상단 2: 아이콘 메뉴 */}
        <IconNav activeView={activeView} setActiveView={setActiveView} />

        {/* 상단 3 & 중간: 동적 콘텐츠 영역 */}
        <div className="space-y-6">{renderContent()}</div>

        {/* 하단: 지능형 제안 */}
        <SuggestionCard />
      </main>
    </div>
  );
}
