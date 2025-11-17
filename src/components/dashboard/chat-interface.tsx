'use client';
import { useState, useEffect } from 'react';
import { CornerDownLeft, Mic, MicOff } from 'lucide-react';
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
    if (!input.trim()) return;

    setIsProcessing(true);
    
    try {
      const result: ClassifyCommandOutput = await classifyCommand({ command: input });
      onCommandProcessed(result.category as View);
      toast({
        title: '명령어 분류 완료',
        description: `'${result.category}' (으)로 분류되었습니다.`,
      });
    } catch (error) {
      console.error("Error classifying command:", error);
      toast({
        variant: "destructive",
        title: "분류 실패",
        description: "명령어를 분류하는 중 오류가 발생했습니다.",
      });
      onCommandProcessed('UNKNOWN');
    } finally {
      setInput('');
      setIsProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex w-full items-center rounded-lg border bg-card p-2 shadow-sm"
    >
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="명령을 입력하거나 마이크를 사용하세요..."
        className="flex-1 border-0 bg-transparent pr-20 text-base text-primary focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={isProcessing}
      />
      <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center">
        {isClient && hasSpeechSupport && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleToggleListening}
            disabled={isProcessing}
            className="h-8 w-8"
          >
            {isListening ? (
              <MicOff className="size-4 text-destructive" />
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
          className="h-8 w-8"
        >
          <CornerDownLeft className="size-4" />
        </Button>
      </div>
    </form>
  );
}
