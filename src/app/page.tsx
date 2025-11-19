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
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type View = 'SCHEDULE' | 'NOTES' | 'TASKS' | 'MEETINGS' | 'BRIEFING' | 'UNKNOWN';

const viewTitles: Record<View, string> = {
  SCHEDULE: '일정',
  NOTES: '노트',
  TASKS: '작업',
  MEETINGS: '회의',
  BRIEFING: '데일리 브리핑',
  UNKNOWN: '알 수 없음',
};

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<View | null>(null);

  const handleIconClick = (view: View) => {
    setActiveView(view);
  };

  const handleModalClose = (isOpen: boolean) => {
    if (!isOpen) {
      setActiveView(null);
    }
  };

  const renderContentForView = (view: View) => {
    switch (view) {
      case 'SCHEDULE':
        return (
          <div className="space-y-6">
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
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="대시보드"
        description="에이전트 코어에 오신 것을 환영합니다. 오늘의 개요입니다."
      />
      <main className="flex-1 space-y-6 p-4 sm:p-6">
        <ChatInterface onCommandProcessed={setActiveView} />
        <Card className="p-2">
          <IconNav onIconClick={handleIconClick} />
        </Card>
        <UpcomingSchedule />
        <SuggestionCard />
      </main>

      <Dialog open={activeView !== null && activeView !== 'UNKNOWN'} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[425px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>{activeView ? viewTitles[activeView] : ''}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            {activeView && renderContentForView(activeView)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
