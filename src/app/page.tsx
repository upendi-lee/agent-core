'use client';
import { useState } from 'react';
import {
  Calendar,
  ClipboardList,
  HeartPulse,
  Mic,
  Send,
  Users,
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

type DialogType = 'schedule' | 'notes' | null;

const navItems = [
  {
    id: 'schedule',
    label: '일정',
    icon: Calendar,
    color: 'bg-orange-100 text-orange-600',
  },
  { id: 'tasks', label: '할일', icon: ClipboardList, color: 'bg-purple-100 text-purple-600' },
  { id: 'meetings', label: '회의', icon: Users, color: 'bg-green-100 text-green-600' },
  {
    id: 'notes',
    label: '노트',
    icon: ClipboardList,
    color: 'bg-blue-100 text-blue-600',
  },
  { id: 'briefing', label: '브리핑', icon: HeartPulse, color: 'bg-red-100 text-red-600' },
];

export default function DashboardPage() {
  const [openDialog, setOpenDialog] = useState<DialogType>(null);

  const renderDialogContent = () => {
    switch (openDialog) {
      case 'schedule':
        return (
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>일정 관리</DialogTitle>
            </DialogHeader>
            <ScheduleManager />
          </DialogContent>
        );
      case 'notes':
        return (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>지능형 노트 필기</DialogTitle>
            </DialogHeader>
            <NoteTaker />
          </DialogContent>
        );
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
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {navItems.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl ${item.color}`}
                    onClick={() => {
                      if (item.id === 'schedule' || item.id === 'notes') {
                        setOpenDialog(item.id);
                      }
                    }}
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

          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="relative">
                <Input
                  placeholder="무엇을 도와드릴까요?"
                  className="h-12 rounded-full bg-muted pr-24 text-base"
                />
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
                  <Mic className="h-5 w-5 text-muted-foreground" />
                  <Button size="icon" className="h-9 w-9 rounded-full">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <AISuggestionCard />
          <RecentActivityCard />
        </main>
      </div>
      {renderDialogContent()}
    </Dialog>
  );
}
