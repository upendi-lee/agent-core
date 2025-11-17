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
    text: '일정 충돌: "고객 전화"와 "디자인 검토"가 30분 겹칩니다.',
  },
  {
    type: 'suggestion',
    text: '"항공권 구매" 메모를 기반으로 작업을 생성하시겠습니까?',
  },
];

export function SuggestionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>지능형 제안</CardTitle>
        <CardDescription>사전 알림 및 팁.</CardDescription>
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
