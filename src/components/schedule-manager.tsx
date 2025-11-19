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

export function ScheduleManager() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      variant: 'destructive',
      title: '기능 비활성화됨',
      description: '현재 Google 캘린더 연동이 완료되지 않아 저장할 수 없습니다.',
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
          <Tabs defaultValue="event">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="event">일정</TabsTrigger>
              <TabsTrigger value="task">할 일</TabsTrigger>
              <TabsTrigger value="appointment">약속 일정</TabsTrigger>
            </TabsList>
            <TabsContent value="event" className="mt-4 space-y-4">
              <Input placeholder="제목 추가" className="text-lg h-12" />
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">11월 19일 (수요일) ⋅ 오후 4:00 - 오후 5:00</div>
                </div>
                <div className="flex items-center gap-4">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <Input placeholder="참석자 추가" className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                </div>
                <div className="flex items-center gap-4">
                  <Video className="h-5 w-5 text-muted-foreground" />
                  <Button variant="outline" size="sm">Google Meet 화상 회의 추가</Button>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                   <Input placeholder="위치 추가" className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                </div>
                <div className="flex items-center gap-4">
                  <AlignLeft className="h-5 w-5 text-muted-foreground" />
                  <Input placeholder="설명 또는 파일 추가" className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
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
                        <Input placeholder="설명 추가" className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
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
            <Button onClick={handleSave}>저장</Button>
        </CardFooter>
      </Card>
      <CalendarView />
    </div>
  );
}
