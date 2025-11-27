'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { extractInfo } from '@/ai/flows/extract-info';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Mic, MicOff } from 'lucide-react';
import { useSpeech } from '@/hooks/use-speech';

interface QuickInputProps {
    onExtracted: (data: {
        category: 'SCHEDULE' | 'NOTE' | 'TASK' | 'SCHEDULE_QUERY' | 'BRIEFING';
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
    const { isListening, transcript, startListening, stopListening, hasSpeechSupport } = useSpeech();

    useEffect(() => {
        if (isListening && transcript) {
            setInput(transcript);
        }
    }, [transcript, isListening]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (isListening) {
            stopListening();
        }

        setIsProcessing(true);
        try {
            const result = await extractInfo({ userInput: input });
            onExtracted(result);
            setInput('');
            toast({
                title: '정보 추출 완료',
                description: `${result.category === 'SCHEDULE' ? '일정' : result.category === 'NOTE' ? '노트' : result.category === 'TASK' ? '할일' : result.category === 'BRIEFING' ? '브리핑' : '일정 조회'}로 분류되었습니다.`,
            });
        } catch (error: any) {
            console.error('정보 추출 실패:', error);
            toast({
                variant: 'destructive',
                title: '처리 실패',
                description: `오류: ${error.message || JSON.stringify(error)}`,
                duration: 10000,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
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
                            placeholder={isListening ? "듣고 있습니다..." : "자연어로 입력하세요... 예: 내일 오후 2시에 팀 회의"}
                            className={`pl-10 pr-10 ${isListening ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                            disabled={isProcessing}
                        />
                        {hasSpeechSupport && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent ${isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}
                                onClick={toggleListening}
                            >
                                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            </Button>
                        )}
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
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    💡 AI가 자동으로 카테고리를 분류하고 제목, 시간을 추출합니다
                    {isListening && <span className="text-red-500 font-medium ml-2">● 녹음 중</span>}
                </p>
            </CardContent>
        </Card>
    );
}
