import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lightbulb, AlertTriangle } from 'lucide-react';

const mockSuggestions = [
  {
    type: 'alert',
    text: 'Schedule conflict: "Client Call" and "Design Review" overlap by 30 mins.',
  },
  {
    type: 'suggestion',
    text: 'Based on your note "buy flight tickets", create a task for it?',
  },
];

export function SuggestionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Intelligent Suggestions</CardTitle>
        <CardDescription>Proactive alerts and tips.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockSuggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3">
              <div>
                {suggestion.type === 'alert' ? (
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
                ) : (
                  <Lightbulb className="mt-0.5 size-5 shrink-0 text-yellow-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{suggestion.text}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
