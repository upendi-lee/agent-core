'use client';
import { Calendar, Notebook, ListTodo, MicVocal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type View = 'SCHEDULE' | 'NOTES' | 'TASKS' | 'MEETINGS' | 'BRIEFING';

interface IconNavProps {
  onIconClick: (view: View) => void;
  activeView?: View | null;
}

const navItems = [
  { id: 'SCHEDULE', label: '일정', icon: Calendar },
  { id: 'NOTES', label: '노트', icon: Notebook },
  { id: 'TASKS', label: '작업', icon: ListTodo },
  { id: 'MEETINGS', label: '회의', icon: MicVocal },
  { id: 'BRIEFING', label: '브리핑', icon: Sparkles },
] as const;

export function IconNav({ onIconClick, activeView }: IconNavProps) {
  return (
    <div className="flex justify-around p-2">
      {navItems.map((item) => (
        <div key={item.id} className="flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            className={cn(
              'flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-muted',
              activeView === item.id ? 'bg-accent text-accent-foreground' : ''
            )}
            onClick={() => onIconClick(item.id)}
          >
            <item.icon className="size-7" />
          </Button>
          <span className="text-xs font-medium text-muted-foreground">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
