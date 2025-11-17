'use client';
import { useState, useRef, useEffect } from 'react';
import { CornerDownLeft, Mic, MicOff, Bot } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSpeech } from '@/hooks/use-speech';
import { cn } from '@/lib/utils';
import { intelligentNoteTaking } from '@/ai/flows/intelligent-note-taking';
import { createSchedule } from '@/ai/flows/smart-schedule-management';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Message = {
  role: 'user' | 'assistant';
  content: React.ReactNode;
};

type Intent = 'note' | 'schedule' | 'general';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [intent, setIntent] = useState<Intent>('general');
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasSpeechSupport,
  } = useSpeech();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

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

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      let assistantResponse: Message = {
        role: 'assistant',
        content: 'Sorry, I am not sure how to handle that.',
      };

      if (intent === 'note') {
        const result = await intelligentNoteTaking({ noteContent: input });
        assistantResponse.content = (
          <div>
            <p>Note saved! I've suggested some tags for you:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.suggestedTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        );
      } else if (intent === 'schedule') {
        const result = await createSchedule({
          action: 'create',
          description: input,
        });
        assistantResponse.content = result.message;
      } else {
        assistantResponse.content = `I understood your message: "${input}". General conversation is not yet implemented.`;
      }
      setMessages((prev) => [...prev, assistantResponse]);
    } catch (error) {
      console.error('AI processing error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong while processing your request.',
      });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, an error occurred. Please try again.',
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Command Center</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-4',
                  message.role === 'user' ? 'justify-end' : ''
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>
                      <Bot className="size-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-lg p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage
                      src={userAvatar?.imageUrl}
                      alt="User"
                      data-ai-hint={userAvatar?.imageHint}
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback>
                    <Bot className="size-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[75%] rounded-lg bg-muted p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 delay-150" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 delay-300" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={handleSubmit}
          className="relative flex w-full items-center gap-2"
        >
          <Select
            onValueChange={(value: Intent) => setIntent(value)}
            defaultValue="general"
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select intent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="note">Create Note</SelectItem>
              <SelectItem value="schedule">Schedule</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command or use the microphone..."
            className="flex-1 pr-20"
            disabled={isProcessing}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            {hasSpeechSupport && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleToggleListening}
                disabled={isProcessing}
              >
                {isListening ? (
                  <MicOff className="text-destructive" />
                ) : (
                  <Mic />
                )}
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              disabled={!input.trim() || isProcessing}
            >
              <CornerDownLeft />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
