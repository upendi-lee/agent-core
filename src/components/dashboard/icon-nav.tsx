'use client';
import {
  Calendar,
  Notebook,
  ListTodo,
  MicVocal,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';

type View = 'SCHEDULE' | 'NOTES' | 'TASKS' | 'MEETINGS' | 'BRIEFING';

interface IconNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const navItems = [
  {
    id: 'SCHEDULE',
    label: '일정',
    icon: Calendar,
  },
  {
    id: 'NOTES',
    label: '노트',
    icon: Notebook,
  },
  {
    id: 'TASKS',
    label: '작업',
    icon: ListTodo,
  },
  {
    id: 'MEETINGS',
    label: '회의',
    icon: MicVocal,
  },
  {
    id: 'BRIEFING',
    label: '브리핑',
    icon: Sparkles,
  },
] as const;

export function IconNav({ activeView, setActiveView }: IconNavProps) {
  return (
    <Card>
      <div className="flex justify-around p-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              'flex flex-col items-center h-auto gap-1',
              activeView === item.id ? 'text-primary' : 'text-muted-foreground'
            )}
            onClick={() => setActiveView(item.id)}
          >
            <item.icon className="size-6" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
