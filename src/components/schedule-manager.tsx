'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
  Users,
  Video,
  MapPin,
  AlignLeft,
  Calendar as CalendarIcon,
  ListTodo,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CalendarView } from './dashboard/calendar-view';
import { createCalendarEventAction, createCalendarTaskAction } from '@/app/actions/google';

interface ScheduleManagerProps {
  defaultTab?: 'event' | 'task';
  initialData?: {
    title?: string;
    description?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  };
  autoSave?: boolean;
  onSaved?: () => void;
}

export function ScheduleManager({ defaultTab = 'event', initialData, autoSave = false, onSaved }: ScheduleManagerProps) {
  const { toast } = useToast();
  // Initialize with empty strings to avoid hydration mismatch
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasAutoSaved, setHasAutoSaved] = useState(false);

  // Set initial data or defaults on mount
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setStartTime(initialData.startTime || '09:00');
      setEndTime(initialData.endTime || '10:00');
    } else {
      // Set defaults if no initial data
      setDate(new Date().toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('10:00');
    }
  }, [initialData]);

  const saveEvent = async (data: {
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    if (!data.title) {
      toast({
        variant: 'destructive',
        title: '입력 오류',
        description: '제목을 입력해주세요.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('date', data.date);
      formData.append('startTime', data.startTime);
      formData.append('endTime', data.endTime);

      let result;
      if (defaultTab === 'task') {
        result = await createCalendarTaskAction(formData);
      } else {
        result = await createCalendarEventAction(formData);
      }

      if (result.success) {
        toast({
          title: defaultTab === 'task' ? '할 일 저장 성공' : '일정 저장 성공',
          description: defaultTab === 'task' ? 'Google 캘린더에 할 일이 저장되었습니다.' : 'Google 캘린더에 일정이 저장되었습니다.',
        });
        // Reset form only if manual save (optional, but good UX)
        if (!autoSave) {
          setTitle('');
          setDescription('');
        }
        if (onSaved) onSaved();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        variant: 'destructive',
        title: '저장 실패',
        description: error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (autoSave && initialData && !hasAutoSaved && initialData.title) {
      setHasAutoSaved(true);
      saveEvent({
        title: initialData.title,
        description: initialData.description || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        startTime: initialData.startTime || '09:00',
        endTime: initialData.endTime || '10:00',
      });
    }
  }, [autoSave, initialData, hasAutoSaved]);

  const handleSave = () => {
    saveEvent({
      title,
      description,
      date,
      startTime,
      endTime,
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="p-4">
          <CardTitle>이벤트 관리</CardTitle>
          <CardDescription>
            Google 캘린더와 연동하여 일정을 관리하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Tabs defaultValue={defaultTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="event">일정</TabsTrigger>
              <TabsTrigger value="task">할 일</TabsTrigger>
              <TabsTrigger value="appointment">약속 일정</TabsTrigger>
            </TabsList>
            <TabsContent value="event" className="mt-4 space-y-4">
              <Input
                placeholder="제목 추가"
                className="text-lg h-12"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="flex gap-2 items-center">
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-40"
                    />
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-24"
                    />
                    <span>-</span>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-24"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <Input placeholder="참석자 추가" className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                </div>
                <div className="flex items-center gap-4">
                  <Video className="h-5 w-5 text-muted-foreground" />
                  <Button variant="outline" size="sm">Google Meet 화상 회의 추가</Button>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Input placeholder="위치 추가" className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                </div>
                <div className="flex items-center gap-4">
                  <AlignLeft className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="설명 또는 파일 추가"
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm">이원석</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="task" className="mt-4 space-y-4">
              <Input placeholder="할 일 제목 추가" className="text-lg h-12" />
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <AlignLeft className="h-5 w-5 text-muted-foreground" />
                  <Input placeholder="설명 추가" className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <Input type="date" className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                </div>
                <div className="flex items-center gap-4">
                  <ListTodo className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm">Tasks</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="appointment" className="mt-4 text-center text-sm text-muted-foreground">
              <p>약속 일정 기능은 현재 지원되지 않습니다.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 p-4 pt-0">
          <Button variant="ghost">옵션 더보기</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </CardFooter>
      </Card>
      <CalendarView />
    </div>
  );
}
