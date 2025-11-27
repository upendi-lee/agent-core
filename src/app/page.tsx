'use client';
import { useState } from 'react';
import {
  Calendar,
  ClipboardList,
  HeartPulse,
  Mic,
  Send,
  Users,
  Mail,
  Cloud,
  FolderKanban,
} from 'lucide-react';
import { AgentCoreLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserNav } from '@/components/user-nav';
import { AISuggestionCard } from '@/components/dashboard/ai-suggestion-card';
import { RecentActivityCard } from '@/components/dashboard/recent-activity-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScheduleManager } from '@/components/schedule-manager';
import { NoteTaker } from '@/components/note-taker';
import { MeetingSummarizer } from '@/components/meeting-summarizer';
import { DailyBriefing } from '@/components/dashboard/daily-briefing';
import { QuickInput } from '@/components/quick-input';
import { HealthDialog, MailDialog, WeatherDialog, ProjectDialog } from '@/components/dashboard/placeholder-dialogs';
import { ScheduleListDialog } from '@/components/schedule-list-dialog';

type DialogType = 'schedule' | 'notes' | 'meetings' | 'briefing' | 'health' | 'mail' | 'weather' | 'project' | 'schedule_list' | null;
type ScheduleTab = 'event' | 'task';

const navItems = [
  {
    id: 'schedule',
    label: '일정',
    icon: Calendar,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 'notes',
    label: '노트',
    icon: ClipboardList,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'tasks',
    label: '할일',
    icon: ClipboardList,
    color: 'bg-purple-100 text-purple-600',
  },
  { id: 'meetings', label: '회의', icon: Users, color: 'bg-green-100 text-green-600' },
  { id: 'briefing', label: '브리핑', icon: HeartPulse, color: 'bg-red-100 text-red-600' },
  { id: 'health', label: '건강', icon: HeartPulse, color: 'bg-pink-100 text-pink-600' },
  { id: 'mail', label: '메일', icon: Mail, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'weather', label: '날씨', icon: Cloud, color: 'bg-cyan-100 text-cyan-600' },
  { id: 'project', label: '프로젝트', icon: FolderKanban, color: 'bg-indigo-100 text-indigo-600' },
];

export default function DashboardPage() {
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [initialTab, setInitialTab] = useState<ScheduleTab>('event');
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [noteData, setNoteData] = useState<string>('');
  const [autoSave, setAutoSave] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleNavClick = (id: string) => {
    setAutoSave(false);
    if (id === 'schedule') {
      setInitialTab('event');
      setOpenDialog('schedule');
    } else if (id === 'tasks') {
      setInitialTab('task');
      setOpenDialog('schedule');
    } else if (id === 'notes') {
      setNoteData(''); // Reset note data on manual open
      setOpenDialog('notes');
    } else if (id === 'meetings') {
      setOpenDialog('meetings');
    } else if (id === 'briefing') {
      setOpenDialog('briefing');
    } else if (id === 'health') {
      setOpenDialog('health');
    } else if (id === 'mail') {
      setOpenDialog('mail');
    } else if (id === 'weather') {
      setOpenDialog('weather');
    } else if (id === 'project') {
      setOpenDialog('project');
    }
  };

  const handleQuickInput = (data: {
    category: 'SCHEDULE' | 'NOTE' | 'TASK' | 'SCHEDULE_QUERY' | 'BRIEFING';
    title: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
  }) => {
    setAutoSave(true);

    // Heuristic fallback: If title contains "알려줘" or "보여줘" and category is SCHEDULE, treat as QUERY
    let finalCategory = data.category;
    if (finalCategory === 'SCHEDULE' && (data.title.includes('알려줘') || data.title.includes('보여줘'))) {
      finalCategory = 'SCHEDULE_QUERY';
    }

    if (finalCategory === 'SCHEDULE') {
      setScheduleData({
        title: data.title,
        description: data.description,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
      });
      setInitialTab('event');
      setOpenDialog('schedule');
    } else if (finalCategory === 'TASK') {
      setScheduleData({
        title: data.title,
        description: data.description,
        date: data.date,
      });
      setInitialTab('task');
      setOpenDialog('schedule');
    } else if (finalCategory === 'NOTE') {
      setNoteData(data.title); // Use title as content for notes
      setOpenDialog('notes');
    } else if (finalCategory === 'SCHEDULE_QUERY') {
      setOpenDialog('schedule_list');
    } else if (finalCategory === 'BRIEFING') {
      setOpenDialog('briefing');
    }
  };

  const renderDialogContent = () => {
    switch (openDialog) {
      case 'schedule':
        return (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>일정 관리</DialogTitle>
            </DialogHeader>
            <ScheduleManager defaultTab={initialTab} initialData={scheduleData} autoSave={autoSave} onSaved={handleRefresh} />
          </DialogContent>
        );
      case 'notes':
        return (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>지능형 노트 필기</DialogTitle>
            </DialogHeader>
            <NoteTaker initialContent={noteData} autoSave={autoSave} onSaved={handleRefresh} />
          </DialogContent>
        );
      case 'meetings':
        return (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>AI 기반 회의 요약</DialogTitle>
            </DialogHeader>
            <MeetingSummarizer />
          </DialogContent>
        );
      case 'briefing':
        return (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>데일리 브리핑</DialogTitle>
            </DialogHeader>
            <DailyBriefing />
          </DialogContent>
        );
      case 'health':
        return (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>건강 관리</DialogTitle>
            </DialogHeader>
            <HealthDialog />
          </DialogContent>
        );
      case 'mail':
        return (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>메일함</DialogTitle>
            </DialogHeader>
            <MailDialog />
          </DialogContent>
        );
      case 'weather':
        return (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>날씨 정보</DialogTitle>
            </DialogHeader>
            <WeatherDialog />
          </DialogContent>
        );
      case 'project':
        return (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>프로젝트 관리</DialogTitle>
            </DialogHeader>
            <ProjectDialog />
          </DialogContent>
        );
      case 'schedule_list':
        return <ScheduleListDialog />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={openDialog !== null} onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
      <div className="flex min-h-screen w-full flex-col bg-background p-4 font-sans sm:max-w-md mx-auto">
        <header className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <AgentCoreLogo className="h-8 w-8" />
            <h1 className="text-xl font-bold">에이전트 코어</h1>
          </div>
          <UserNav />
        </header>

        <main className="flex-1 space-y-6 pt-4">
          <div className="grid grid-cols-5 gap-4 pb-4">
            {navItems.map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-2">
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl ${item.color}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <item.icon className="h-7 w-7" />
                  </Button>
                </DialogTrigger>
                <span className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <QuickInput onExtracted={handleQuickInput} />

          <AISuggestionCard />
          <RecentActivityCard refreshTrigger={refreshTrigger} />
        </main>
      </div>
      {renderDialogContent()}
    </Dialog>
  );
}
