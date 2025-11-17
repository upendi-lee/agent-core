import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const mockEvents = [
  { time: '오전 09:00', title: '팀 스탠드업' },
  { time: '오전 11:30', title: '디자인 검토' },
  { time: '오후 02:00', title: '고객 전화 - 프로젝트 피닉스' },
  { time: '오후 04:30', title: '사라와 1대1 면담' },
];

export function UpcomingSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>오늘의 예정된 일정</CardTitle>
        <CardDescription>당신의 일정을 빠르게 확인하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        {mockEvents.length > 0 ? (
          <ul className="space-y-4">
            {mockEvents.map((event, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="font-mono text-sm text-muted-foreground">
                  {event.time}
                </span>
                <div className="flex flex-col">
                  <p className="font-medium">{event.title}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <Calendar className="size-8" />
            <p className="text-sm">오늘 예정된 이벤트가 없습니다.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
