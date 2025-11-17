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
import { Calendar } from '@/components/ui/calendar';
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

type Action = 'create' | 'modify' | 'delete';

export function ScheduleManager() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [description, setDescription] = useState('');
  const [action, setAction] = useState<Action>('create');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input required',
        description: 'Please provide a description for the schedule action.',
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
        title: response.success ? 'Success' : 'Error',
        description: response.message,
        variant: response.success ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Schedule management error:', error);
      const errorMessage =
        'An error occurred while managing your schedule. Please try again.';
      setResult(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Operation Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Your current schedule overview.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Schedule</CardTitle>
          <CardDescription>
            Use natural language to manage your events.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select
              onValueChange={(value: Action) => setAction(value)}
              defaultValue="create"
            >
              <SelectTrigger id="action">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create">Create Event</SelectItem>
                <SelectItem value="modify">Modify Event</SelectItem>
                <SelectItem value="delete">Delete Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='e.g., "Schedule a meeting with the marketing team tomorrow at 3pm to discuss Q3 strategy."'
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
            {action.charAt(0).toUpperCase() + action.slice(1)} Event
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
