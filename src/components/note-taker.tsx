'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { intelligentNoteTaking } from '@/ai/flows/intelligent-note-taking';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';

interface Note {
  content: string;
  tags: string[];
  date: string;
}

const mockNotes: Note[] = [
  {
    content: '제품 팀과의 회의는 생산적이었습니다. 3분기 새로운 기능 로드맵을 결정했습니다. 핵심 내용: 사용자 피드백 통합을 우선시합니다.',
    tags: ['제품', '회의', '로드맵'],
    date: '2일 전',
  },
  {
    content: '새로운 마케팅 캠페인에 대한 몇 가지 아이디어를 브레인스토밍했습니다. 소셜 미디어 참여 및 인플루언서 협업에 중점을 둡니다.',
    tags: ['마케팅', '아이디어', '소셜-미디어'],
    date: '4일 전',
  },
];

export function NoteTaker() {
  const [noteContent, setNoteContent] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const { toast } = useToast();

  const handleContentChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const content = e.target.value;
    setNoteContent(content);
    if (content.trim().length > 20 && !isLoading) {
      setIsLoading(true);
      try {
        const result = await intelligentNoteTaking({ noteContent: content });
        setSuggestedTags(result.suggestedTags);
      } catch (error) {
        console.error('태그 제안 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) {
      toast({
        variant: 'destructive',
        title: '빈 노트',
        description: '빈 노트는 저장할 수 없습니다.',
      });
      return;
    }
    const newNote: Note = {
      content: noteContent,
      tags: suggestedTags,
      date: '방금 전',
    };
    setNotes([newNote, ...notes]);
    setNoteContent('');
    setSuggestedTags([]);
    toast({ title: '노트 저장됨', description: '새 노트가 저장되었습니다.' });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>새 노트</CardTitle>
          <CardDescription>
            생각을 적어보세요. 입력하는 동안 태그가 제안됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={noteContent}
            onChange={handleContentChange}
            placeholder="작성 시작..."
            rows={10}
          />
          <div className="mt-4 min-h-[40px]">
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>태그 생성 중...</span>
              </div>
            )}
            {!isLoading && suggestedTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">제안된 태그:</span>
                {suggestedTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveNote} disabled={!noteContent.trim()}>
            <Plus className="mr-2 h-4 w-4" />
            노트 저장
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>최근 노트</CardTitle>
          <CardDescription>이전에 저장한 노트입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notes.map((note, index) => (
              <div key={index} className="rounded-md border p-4">
                <p className="text-sm text-muted-foreground">{note.content}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {note.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
