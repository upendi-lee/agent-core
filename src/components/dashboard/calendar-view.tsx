'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { ko } from 'date-fns/locale';

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDate(new Date());
  }, []);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>캘린더</CardTitle>
          <CardDescription>현재 일정 개요입니다.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center h-[350px] items-center">
          {/* Placeholder to prevent layout shift */}
          <div className="text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>캘린더</CardTitle>
        <CardDescription>현재 일정 개요입니다.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          locale={ko}
        />
      </CardContent>
    </Card>
  );
}
