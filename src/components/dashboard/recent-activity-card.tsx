import { useState, useEffect } from 'react';
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

interface RecentActivityCardProps {
  refreshTrigger?: number;
}

export function RecentActivityCard({ refreshTrigger = 0 }: RecentActivityCardProps) {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { getRecentActivityAction } = await import('@/app/actions/google');
        const result = await getRecentActivityAction();
        if (result.success) {
          setActivities(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [refreshTrigger]);

  const getIcon = (collection: string) => {
    switch (collection) {
      case 'notes': return ClipboardList;
      case 'tasks': return ClipboardCheck;
      case 'schedules': return Calendar;
      case 'meetings': return Users;
      default: return ClipboardList;
    }
  };

  const getTitle = (item: any) => {
    return item.title || item.content?.slice(0, 20) || '제목 없음';
  };

  const getTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffMins = Math.floor(diff / 60000);
    const diffHours = Math.floor(diff / 3600000);
    const diffDays = Math.floor(diff / 86400000);

    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
  };

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
          {isLoading ? (
            <div className="col-span-2 text-center text-sm text-muted-foreground py-4">로딩 중...</div>
          ) : activities.length > 0 ? (
            activities.slice(0, 4).map((activity, index) => {
              const Icon = getIcon(activity.collection);
              return (
                <Card key={index} className="rounded-xl p-4">
                  <div className="flex flex-col gap-2">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                    <span className="font-semibold truncate">{getTitle(activity)}</span>
                    <span className="text-xs text-muted-foreground">
                      {getTime(activity.createdAt)}
                    </span>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-2 text-center text-sm text-muted-foreground py-4">최근 활동이 없습니다.</div>
          )}

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
