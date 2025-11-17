import { PageHeader } from '@/components/page-header';
import { NoteTaker } from '@/components/note-taker';

export default function NotesPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Intelligent Note-Taking"
        description="Create notes with automatic tag suggestions."
      />
      <main className="flex-1 p-4 sm:p-6">
        <NoteTaker />
      </main>
    </div>
  );
}
