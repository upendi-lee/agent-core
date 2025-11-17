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

type View = 'SCHEDULE' | 'NOTES' | 'TASKS' | 'MEETINGS' | 'BRIEFING';

interface IconNavProps {
  onIconClick: (view: View) => void;
  activeView?: View | null;
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

export function IconNav({ onIconClick, activeView }: IconNavProps) {
  return (
    <div className="flex justify-around p-2">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={cn(
            'flex flex-col items-center h-auto gap-1',
            activeView === item.id ? 'text-primary' : 'text-muted-foreground'
          )}
          onClick={() => onIconClick(item.id)}
        >
          <item.icon className="size-6" />
          <span className="text-xs">{item.label}</span>
        </Button>
      ))}
    </div>
  );
}
