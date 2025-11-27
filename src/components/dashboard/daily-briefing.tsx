'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { generateDailyBriefing } from '@/ai/flows/daily-briefing';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { getDailyBriefingDataAction } from '@/app/actions/google';

export function DailyBriefing() {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateBriefing = async () => {
    setIsLoading(true);
    setBriefing(null);
    try {
      // 1. Fetch Real Data
      const dataResult = await getDailyBriefingDataAction();
      if (!dataResult.success || !dataResult.data) {
        throw new Error(dataResult.message || '데이터를 불러올 수 없습니다.');
      }

      const { schedules, tasks, notes } = dataResult.data;

      // 2. Format Data for AI
      const scheduleSummary = schedules.length > 0
        ? schedules.map((s: any) => `- ${s.summary} (${s.start.dateTime || s.start.date})`).join('\n')
        : '오늘 예정된 일정이 없습니다.';

      const taskSummary = tasks.length > 0
        ? tasks.map((t: any) => `- ${t.title}`).join('\n')
        : '할 일이 없습니다.';

      const noteSummary = notes.length > 0
        ? notes.map((n: any) => `- ${n.title}: ${n.content.substring(0, 50)}...`).join('\n')
        : '중요한 노트가 없습니다.';

      // 3. Generate Briefing
      const result = await generateDailyBriefing({
        schedules: scheduleSummary,
        toDoLists: taskSummary,
        importantNotes: noteSummary,
        currentDate: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
      });

      setBriefing(result.briefing);
    } catch (error) {
      console.error('데일리 브리핑 생성 오류:', error);
      toast({
        variant: 'destructive',
        title: '브리핑 실패',
        description: '데일리 브리핑을 생성할 수 없습니다. 다시 시도해 주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simple Markdown Renderer
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Header 1
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-4 mb-2 text-primary">{line.replace('# ', '')}</h1>;
      }
      // Header 2
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-4 mb-2 text-foreground">{line.replace('## ', '')}</h2>;
      }
      // Bold replacement (simple regex)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={index} className="min-h-[1.5rem]">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      <p className="px-6 pb-4 text-sm text-muted-foreground">
        하루의 일정, 작업, 노트를 요약하여 브리핑을 받아보세요.
      </p>
      <CardContent className="flex-1 overflow-hidden flex flex-col">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">브리핑 생성 중...</span>
          </div>
        )}
        {briefing && !isLoading && (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-1 text-sm text-muted-foreground">
              {renderMarkdown(briefing)}
            </div>
            <div className="flex justify-center pt-6 pb-2">
              <Button onClick={handleGenerateBriefing} disabled={isLoading} variant="outline" size="sm">
                새로 고침
              </Button>
            </div>
          </ScrollArea>
        )}
        {!briefing && !isLoading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <Button onClick={handleGenerateBriefing} disabled={isLoading}>
              브리핑 생성 시작
            </Button>
          </div>
        )}
      </CardContent>
    </div>
  );
}
