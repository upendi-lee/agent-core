'use client';

import { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ScheduleListDialogProps {
    date?: Date;
}

export function ScheduleListDialog({ date = new Date() }: ScheduleListDialogProps) {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const fetchSchedules = async () => {
            setIsLoading(true);
            try {
                // Import dynamically to avoid server-side issues if any
                const { getCalendarEvents } = await import('@/app/actions/google');

                // Fetch for the whole day
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);

                const result = await getCalendarEvents(startOfDay.toISOString(), endOfDay.toISOString());
                if (result.success) {
                    setSchedules(result.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch schedules:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedules();
    }, [date]);

    if (!mounted) return null;

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>
                    {format(date, 'M월 d일 (EEE) 일정', { locale: ko })}
                </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">일정을 불러오는 중...</div>
                    ) : schedules.length > 0 ? (
                        schedules.map((schedule, index) => (
                            <Card key={index} className="overflow-hidden">
                                <CardContent className="p-4 flex gap-4">
                                    <div className="flex flex-col items-center justify-center min-w-[60px] border-r pr-4">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {schedule.start?.dateTime ? format(new Date(schedule.start.dateTime), 'a h:mm', { locale: ko }) : '하루 종일'}
                                        </span>
                                        {schedule.end?.dateTime && (
                                            <span className="text-xs text-muted-foreground mt-1">
                                                ~ {format(new Date(schedule.end.dateTime), 'a h:mm', { locale: ko })}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-semibold leading-none">{schedule.summary}</h4>
                                        {schedule.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {schedule.description}
                                            </p>
                                        )}
                                        {schedule.location && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                                <MapPin className="h-3 w-3" />
                                                <span>{schedule.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-2">
                            <Calendar className="h-10 w-10 opacity-20" />
                            <span>예정된 일정이 없습니다.</span>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </DialogContent>
    );
}
