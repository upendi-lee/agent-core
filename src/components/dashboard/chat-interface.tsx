'use client';
import { useState, useRef, useEffect } from 'react';
import { CornerDownLeft, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSpeech } from '@/hooks/use-speech';
import { useToast } from '@/hooks/use-toast';
import { Card } from '../ui/card';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasSpeechSupport,
  } = useSpeech();
  const { toast } = useToast();

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
    // AI 처리 로직은 여기에...
    console.log('Submitted:', input);

    // 임시 응답
    setTimeout(() => {
      toast({
        title: '명령어 처리',
        description: `"${input}" 명령을 처리했습니다. (데모)`,
      });
      setInput('');
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <Card>
      <form
        onSubmit={handleSubmit}
        className="relative flex w-full items-center"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="명령을 입력하거나 마이크를 사용하세요..."
          className="flex-1 rounded-md border-0 bg-background pr-20 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={isProcessing}
        />
        <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center">
          {hasSpeechSupport && (
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
    </Card>
  );
}
