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
import { Loader2, Mic, StopCircle, CheckCircle, ListTodo, FileAudio, UploadCloud, DownloadCloud } from 'lucide-react';
import { meetingSummary } from '@/ai/flows/meeting-summary';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        toast({ title: '녹음이 시작되었습니다' });
      } catch (err) {
        console.error('마이크 접근 오류:', err);
        toast({
          variant: 'destructive',
          title: '마이크 오류',
          description: '마이크에 접근할 수 없습니다.',
        });
      }
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({ title: '녹음이 중지되었습니다' });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setResult(null);
      toast({ title: '오디오 파일이 첨부되었습니다.' });
    }
  };

  const handleSummarize = async () => {
    if (!audioBlob) {
      toast({
        variant: 'destructive',
        title: '오디오 없음',
        description: '먼저 오디오를 녹음하거나 파일을 첨부해 주세요.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    toast({
      variant: 'destructive',
      title: '기능 비활성화됨',
      description: 'AI 기능이 현재 비활성화되어 요약할 수 없습니다.',
    });
    setIsLoading(false);
    // AI 기능 복구 시 아래 코드 사용
    /*
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
        console.error('요약 오류:', error);
        toast({
          variant: 'destructive',
          title: '요약 실패',
          description: '오류가 발생했습니다. 다시 시도해 주세요.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    */
  };

  const handleGoogleDriveAction = async () => {
    if (!result) {
      toast({
        variant: 'destructive',
        title: '저장할 내용 없음',
        description: '먼저 회의를 요약해주세요.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { saveToDriveAction } = await import('@/app/actions/google');
      const content = `회의 요약:\n${result.summary}\n\n실행 항목:\n${result.actionItems.join('\n- ')}`;
      const filename = `Meeting_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;

      const saveResult = await saveToDriveAction(content, filename);

      if (saveResult.success) {
        toast({
          title: '저장 성공',
          description: '회의 요약이 Google Drive에 저장되었습니다.',
        });
      } else {
        throw new Error(saveResult.message);
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        variant: 'destructive',
        title: '저장 실패',
        description: '저장 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>회의 정보</CardTitle>
          <CardDescription>회의 세부 정보를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" placeholder="회의 제목" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attendees">참석자</Label>
            <Input id="attendees" placeholder="소속, 성명" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">일시</Label>
              <Input id="date" type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">장소</Label>
              <Input id="location" placeholder="회의 장소" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea id="content" placeholder="회의 내용 요약" rows={5} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>음성 녹음 및 요약</CardTitle>
            <CardDescription>
              회의를 녹음하거나 오디오 파일을 첨부하여 텍스트로 변환하고 요약합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
            <div className="flex gap-4">
              <Button
                size="lg"
                variant={isRecording ? 'destructive' : 'outline'}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className="w-32"
              >
                {isRecording ? (
                  <StopCircle className="mr-2 h-4 w-4" />
                ) : (
                  <Mic className="mr-2 h-4 w-4" />
                )}
                {isRecording ? '녹음 중지' : '녹음 시작'}
              </Button>
              <Button size="lg" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-32">
                <FileAudio className="mr-2 h-4 w-4" />
                파일 첨부
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
            </div>
            {audioBlob && (
              <div className="mt-4 w-full flex flex-col items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="text-sm">오디오 준비 완료!</p>
                <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
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
              텍스트 변환 및 요약
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>요약 및 실행 항목</CardTitle>
              <CardDescription>생성된 회의록을 확인하고 저장하세요.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleGoogleDriveAction}>
                <UploadCloud className="mr-2 h-4 w-4" />
                저장
              </Button>
              <Button variant="outline" size="sm" onClick={handleGoogleDriveAction}>
                <DownloadCloud className="mr-2 h-4 w-4" />
                불러오기
              </Button>
            </div>
          </CardHeader>
          <CardContent className="min-h-[150px]">
            {isLoading && (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">요약</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {result.summary}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">실행 항목</h3>
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
                <p>회의를 녹음/첨부하고 요약하여 결과를 확인하세요.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
