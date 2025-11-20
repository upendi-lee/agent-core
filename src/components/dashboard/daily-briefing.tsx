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

export function DailyBriefing() {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateBriefing = async () => {
    setIsLoading(true);
    setBriefing(null);
    try {
      const result = await generateDailyBriefing({
        schedules: '오전 9시 스탠드업, 오후 1시 프로젝트 동기화, 오후 4시 관리자와 1:1 미팅.',
        toDoLists:
          '2분기 보고서 완료, 프로젝트 동기화 슬라이드 준비, 컨퍼런스 항공편 예약.',
        importantNotes:
          '새로운 목업에 대해 디자인 팀에 후속 조치하는 것을 잊지 마세요.',
      });
      setBriefing(result.briefing);
       if (result.briefing.includes('비활성화')) {
         toast({
            variant: 'destructive',
            title: '기능 비활성화됨',
            description: 'AI 기능이 현재 비활성화되어 브리핑을 생성할 수 없습니다.',
         });
      }
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

  return (
    <div>
      <p className="px-6 pb-4 text-sm text-muted-foreground">
        하루의 일정, 작업, 노트를 요약하여 브리핑을 받아보세요.
      </p>
      <CardContent>
        {isLoading && (
          <div className="flex min-h-[100px] items-center justify-center">
            <Loader2 className="animate-spin text-primary" />
          </div>
        )}
        {briefing && !isLoading && (
          <ScrollArea className="h-40">
            <p className="text-sm text-muted-foreground">{briefing}</p>
          </ScrollArea>
        )}
        {!briefing && !isLoading && (
          <div className="flex min-h-[100px] flex-col items-center justify-center gap-4 text-center">
             <Button onClick={handleGenerateBriefing} disabled={isLoading}>
              브리핑 생성
            </Button>
          </div>
        )}
         {briefing && !isLoading && (
            <div className="flex justify-center pt-4">
              <Button onClick={handleGenerateBriefing} disabled={isLoading} variant="outline">
                다시 생성
             </Button>
            </div>
        )}
      </CardContent>
    </div>
  );
}
