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
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface Note {
  id: number;
  content: string;
  tags: string[];
  date: string;
}

const mockNotes: Note[] = [
  {
    id: 1,
    content: '제품 팀과의 회의는 생산적이었습니다. 3분기 새로운 기능 로드맵을 결정했습니다. 핵심 내용: 사용자 피드백 통합을 우선시합니다.',
    tags: ['제품', '회의', '로드맵'],
    date: '2일 전',
  },
  {
    id: 2,
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
  const [editingNote, setEditingNote] = useState<Note | null>(null);
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
    
    if (editingNote) {
      // Edit existing note
      const updatedNotes = notes.map(note =>
        note.id === editingNote.id ? { ...note, content: noteContent, tags: suggestedTags, date: '수정됨' } : note
      );
      setNotes(updatedNotes);
      toast({ title: '노트 수정됨', description: '노트가 성공적으로 수정되었습니다.' });
    } else {
      // Add new note
      const newNote: Note = {
        id: Date.now(),
        content: noteContent,
        tags: suggestedTags,
        date: '방금 전',
      };
      setNotes([newNote, ...notes]);
      toast({ title: '노트 저장됨', description: '새 노트가 저장되었습니다.' });
    }
    
    // Reset form
    setNoteContent('');
    setSuggestedTags([]);
    setEditingNote(null);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setSuggestedTags(note.tags);
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({ title: '노트 삭제됨', description: '노트가 삭제되었습니다.' });
  };
  
  const handleCancelEdit = () => {
    setEditingNote(null);
    setNoteContent('');
    setSuggestedTags([]);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{editingNote ? '노트 수정' : '새 노트'}</CardTitle>
          <CardDescription>
            {editingNote ? '노트를 수정하세요.' : '생각을 적어보세요. 입력하는 동안 태그가 제안됩니다.'}
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
        <CardFooter className="flex justify-between">
          <Button onClick={handleSaveNote} disabled={!noteContent.trim()}>
            <Plus className="mr-2 h-4 w-4" />
            {editingNote ? '수정 완료' : '노트 저장'}
          </Button>
          {editingNote && (
            <Button variant="ghost" onClick={handleCancelEdit}>
              취소
            </Button>
          )}
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>최근 노트</CardTitle>
          <CardDescription>이전에 저장한 노트입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="group rounded-md border p-4 relative">
                  <p className="text-sm text-muted-foreground pr-16">{note.content}</p>
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
                   <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditNote(note)}>
                      <p className="text-xs">수정</p>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteNote(note.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
