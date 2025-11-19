'use client';
import { Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function AISuggestionCard() {
  return (
    <Card className="rounded-2xl bg-accent/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI 지능형 제안
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Tip.</span> 오후 3시
          전략회의 전, 지난달 성과 보고서를 요약해 드릴까요?
        </p>
        <div className="flex gap-2">
          <Button className="w-full rounded-full">요약하기</Button>
          <Button variant="ghost" className="w-full rounded-full">
            건너뛰기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
