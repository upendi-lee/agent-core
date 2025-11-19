'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  createSchedule,
  modifySchedule,
  deleteSchedule,
} from '@/ai/flows/smart-schedule-management';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { CalendarView } from './dashboard/calendar-view';

type Action = 'create' | 'modify' | 'delete';

export function ScheduleManager() {
  const [description, setDescription] = useState('');
  const [action, setAction] = useState<Action>('create');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast({
        variant: 'destructive',
        title: '입력 필요',
        description: '일정 작업에 대한 설명을 제공해 주세요.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);

    const actionMap = {
      create: createSchedule,
      modify: modifySchedule,
      delete: deleteSchedule,
    };

    try {
      const response = await actionMap[action]({ action, description });
      setResult(response.message);
      toast({
        title: response.success ? '성공' : '오류',
        description: response.message,
        variant: response.success ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('일정 관리 오류:', error);
      const errorMessage =
        '일정을 관리하는 중에 오류가 발생했습니다. 다시 시도해 주세요.';
      setResult(errorMessage);
      toast({
        variant: 'destructive',
        title: '작업 실패',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const actionToKorean = (action: Action) => {
    switch (action) {
      case 'create':
        return '이벤트 생성';
      case 'modify':
        return '이벤트 수정';
      case 'delete':
        return '이벤트 삭제';
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>이벤트 관리</CardTitle>
          <CardDescription>
            자연어를 사용하여 이벤트를 관리하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action">작업</Label>
            <Select
              onValueChange={(value: Action) => setAction(value)}
              defaultValue="create"
            >
              <SelectTrigger id="action">
                <SelectValue placeholder="작업 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create">이벤트 생성</SelectItem>
                <SelectItem value="modify">이벤트 수정</SelectItem>
                <SelectItem value="delete">이벤트 삭제</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='예: "내일 오후 3시에 마케팅 팀과 3분기 전략 회의 예약"'
              rows={5}
            />
          </div>
          {result && (
            <div className="rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
              {result}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {actionToKorean(action)}
          </Button>
        </CardFooter>
      </Card>
      <CalendarView />
    </div>
  );
}
