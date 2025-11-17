'use client';
import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, StopCircle, CheckCircle, ListTodo } from 'lucide-react';
import { meetingSummary } from '@/ai/flows/meeting-summary';

interface SummaryResult {
  summary: string;
  actionItems: string[];
}

export function MeetingSummarizer() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    setAudioBlob(null);
    setResult(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunksRef.current, {
            type: 'audio/wav',
          });
          setAudioBlob(blob);
          audioChunksRef.current = [];
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast({ title: 'Recording started' });
      } catch (err) {
        console.error('Error accessing microphone:', err);
        toast({
          variant: 'destructive',
          title: 'Microphone Error',
          description: 'Could not access the microphone.',
        });
      }
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({ title: 'Recording stopped' });
    }
  };

  const handleSummarize = async () => {
    if (!audioBlob) {
      toast({
        variant: 'destructive',
        title: 'No Audio',
        description: 'Please record some audio first.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      try {
        const summaryResult = await meetingSummary({
          audioDataUri: base64Audio,
        });
        setResult(summaryResult);
      } catch (error) {
        console.error('Summarization error:', error);
        toast({
          variant: 'destructive',
          title: 'Summarization Failed',
          description: 'An error occurred. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Record Meeting</CardTitle>
          <CardDescription>
            Click start to record your meeting audio.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 p-10">
          <Button
            size="icon"
            className="h-20 w-20 rounded-full"
            variant={isRecording ? 'destructive' : 'default'}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
          >
            {isRecording ? (
              <StopCircle className="h-10 w-10" />
            ) : (
              <Mic className="h-10 w-10" />
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isRecording
              ? 'Recording in progress...'
              : 'Click to start recording'}
          </p>
          {audioBlob && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <p className="text-sm">Audio captured!</p>
              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full max-w-sm" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSummarize}
            disabled={!audioBlob || isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Summarize Audio
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Summary & Action Items</CardTitle>
          <CardDescription>
            Generated summary will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Summary</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {result.summary}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Action Items</h3>
                <ul className="mt-2 space-y-2">
                  {result.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ListTodo className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex h-full items-center justify-center text-center text-muted-foreground">
              <p>Record and summarize your meeting to see the results.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
