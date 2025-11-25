'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { extractInfo } from '@/ai/flows/extract-info';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

interface QuickInputProps {
    onExtracted: (data: {
        category: 'SCHEDULE' | 'NOTE' | 'TASK';
        title: string;
        date?: string;
        startTime?: string;
        endTime?: string;
        description?: string;
    }) => void;
}

export function QuickInput({ onExtracted }: QuickInputProps) {
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsProcessing(true);
        try {
            const result = await extractInfo({ userInput: input });
            onExtracted(result);
            setInput('');
            toast({
                title: '정보 추출 완료',
                description: `${result.category === 'SCHEDULE' ? '일정' : result.category === 'NOTE' ? '노트' : '할일'}로 분류되었습니다.`,
            });
        } catch (error) {
            console.error('정보 추출 실패:', error);
            toast({
                variant: 'destructive',
                title: '처리 실패',
                description: 'AI가 정보를 추출할 수 없습니다. 다시 시도해주세요.',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card className="glass-panel border-2 border-primary/30">
            <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="자연어로 입력하세요... 예: 내일 오후 2시에 팀 회의"
                            className="pl-10"
                            disabled={isProcessing}
                        />
                    </div>
                    <Button type="submit" disabled={isProcessing || !input.trim()}>
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                처리 중
                            </>
                        ) : (
                            '추가'
                        )}
                    </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2">
                    💡 AI가 자동으로 카테고리를 분류하고 제목, 시간을 추출합니다
                </p>
            </CardContent>
        </Card>
    );
}
