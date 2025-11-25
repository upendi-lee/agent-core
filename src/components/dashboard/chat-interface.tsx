'use client';
import { useState, useEffect } from 'react';
import { CornerDownLeft, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSpeech } from '@/hooks/use-speech';
import { useToast } from '@/hooks/use-toast';
import { classifyCommand, type ClassifyCommandOutput } from '@/ai/flows/classify-command';
import type { View } from '@/app/page';

interface ChatInterfaceProps {
  onCommandProcessed: (view: View) => void;
}

export function ChatInterface({ onCommandProcessed }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasSpeechSupport,
  } = useSpeech();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);

    try {
      const result: ClassifyCommandOutput = await classifyCommand({ command: input });
      const category = result.category;
      const view = category === 'UNKNOWN' ? 'UNKNOWN' : category.toLowerCase();

      onCommandProcessed(view as View);
      toast({
        title: '✅ 명령어 분류 완료',
        description: `'${input}' → ${getCategoryLabel(category)}`,
      });
      setInput('');
    } catch (error) {
      console.error("Error classifying command:", error);
      toast({
        variant: "destructive",
        title: "❌ 분류 실패",
        description: "명령어를 분류하는 중 오류가 발생했습니다.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      SCHEDULE: '일정',
      NOTES: '메모',
      TASKS: '할 일',
      MEETINGS: '회의',
      BRIEFING: '브리핑',
      HEALTH: '건강',
      MAIL: '메일',
      WEATHER: '날씨',
      PROJECT: '프로젝트',
      UNKNOWN: '알 수 없음',
    };
    return labels[category] || category;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex w-full items-center rounded-lg border bg-card p-2 shadow-sm transition-all duration-200 ${isProcessing ? 'ring-2 ring-primary/50' : ''
        } ${isListening ? 'ring-2 ring-red-500/50' : ''}`}
    >
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          isListening
            ? '🎤 듣고 있습니다...'
            : isProcessing
              ? '⏳ 처리 중...'
              : '명령을 입력하거나 마이크를 사용하세요...'
        }
        className={`flex-1 border-0 bg-transparent pr-24 text-base text-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all ${isProcessing ? 'opacity-60' : ''
          }`}
        disabled={isProcessing}
      />
      <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {isProcessing && (
          <Loader2 className="size-4 animate-spin text-primary" />
        )}
        {isClient && hasSpeechSupport && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleToggleListening}
            disabled={isProcessing}
            className={`h-8 w-8 transition-all ${isListening ? 'animate-pulse bg-red-500/10' : ''
              }`}
            title={isListening ? '음성 입력 중지' : '음성 입력 시작'}
          >
            {isListening ? (
              <MicOff className="size-4 text-red-500 animate-pulse" />
            ) : (
              <Mic className="size-4" />
            )}
          </Button>
        )}
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          disabled={!input.trim() || isProcessing}
          className="h-8 w-8 transition-all hover:bg-primary/10"
          title="명령 전송"
        >
          <CornerDownLeft className={`size-4 ${isProcessing ? 'opacity-50' : ''}`} />
        </Button>
      </div>
    </form>
  );
}
