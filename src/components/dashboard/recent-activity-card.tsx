'use client';

import {
  Calendar,
  ClipboardCheck,
  ClipboardList,
  Plus,
  Users,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const activities = [
  { icon: Calendar, title: '내일 회의', time: '내일 10:00' },
  { icon: ClipboardList, title: '보고작성 전략', time: '2시간 전' },
  { icon: Users, title: '주간 회의록', time: '어제' },
  { icon: ClipboardCheck, title: '완료보고서', time: 'D-1' },
];

export function RecentActivityCard() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">최근 활동</CardTitle>
        <Button variant="link" className="text-primary">
          더보기 &gt;
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {activities.map((activity, index) => (
            <Card key={index} className="rounded-xl p-4">
              <div className="flex flex-col gap-2">
                <activity.icon className="h-6 w-6 text-muted-foreground" />
                <span className="font-semibold">{activity.title}</span>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            </Card>
          ))}
          <Card className="flex items-center justify-center rounded-xl border-dashed">
            <Button variant="ghost" className="flex flex-col h-auto gap-2">
              <Plus className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium">추가</span>
            </Button>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
