import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

const mockEvents = [
  { time: '09:00 AM', title: 'Team Stand-up' },
  { time: '11:30 AM', title: 'Design Review' },
  { time: '02:00 PM', title: 'Client Call - Project Phoenix' },
  { time: '04:30 PM', title: '1-on-1 with Sarah' },
];

export function UpcomingSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Today</CardTitle>
        <CardDescription>A quick look at your schedule.</CardDescription>
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
            <p className="text-sm">No events scheduled for today.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
