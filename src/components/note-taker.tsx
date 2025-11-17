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
    content: 'Meeting with the product team was productive. We decided on the new feature roadmap for Q3. Key takeaway: prioritize user feedback integration.',
    tags: ['product', 'meeting', 'roadmap'],
    date: '2 days ago',
  },
  {
    content: 'Brainstormed some ideas for the new marketing campaign. Focus on social media engagement and influencer collaborations.',
    tags: ['marketing', 'ideas', 'social-media'],
    date: '4 days ago',
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
        console.error('Tag suggestion error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Note',
        description: 'Cannot save an empty note.',
      });
      return;
    }
    const newNote: Note = {
      content: noteContent,
      tags: suggestedTags,
      date: 'Just now',
    };
    setNotes([newNote, ...notes]);
    setNoteContent('');
    setSuggestedTags([]);
    toast({ title: 'Note Saved', description: 'Your new note has been saved.' });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>New Note</CardTitle>
          <CardDescription>
            Write down your thoughts. Tags will be suggested as you type.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={noteContent}
            onChange={handleContentChange}
            placeholder="Start writing..."
            rows={10}
          />
          <div className="mt-4 min-h-[40px]">
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating tags...</span>
              </div>
            )}
            {!isLoading && suggestedTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Suggested Tags:</span>
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
            Save Note
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Notes</CardTitle>
          <CardDescription>Your previously saved notes.</CardDescription>
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
