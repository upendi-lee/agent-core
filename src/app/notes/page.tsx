import { PageHeader } from '@/components/page-header';
import { NoteTaker } from '@/components/note-taker';

export default function NotesPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="지능형 노트 필기"
        description="자동 태그 제안 기능으로 노트를 작성하세요."
      />
      <main className="flex-1 p-4 sm:p-6">
        <NoteTaker />
      </main>
    </div>
  );
}
