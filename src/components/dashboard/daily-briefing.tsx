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
        schedules: '9 AM stand-up, 1 PM project sync, 4 PM 1-on-1 with manager.',
        toDoLists:
          'Finish Q2 report, Prepare slides for project sync, Book flight for conference.',
        importantNotes:
          'Remember to follow up with the design team about the new mockups.',
      });
      setBriefing(result.briefing);
    } catch (error) {
      console.error('Error generating daily briefing:', error);
      toast({
        variant: 'destructive',
        title: 'Briefing Failed',
        description: 'Could not generate your daily briefing. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Briefing</CardTitle>
        <CardDescription>Your summary for today.</CardDescription>
      </CardHeader>
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
            <p className="text-sm text-muted-foreground">
              Get a summary of your day, including schedule, tasks, and notes.
            </p>
            <Button onClick={handleGenerateBriefing} disabled={isLoading}>
              Generate Briefing
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
