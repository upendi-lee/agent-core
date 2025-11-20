import { PageHeader } from '@/components/page-header';
import { MeetingSummarizer } from '@/components/meeting-summarizer';

export default function MeetingsPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="AI 기반 회의 요약"
        description="회의 내용을 작성하고, 오디오를 녹음하여 요약 및 실행 항목을 생성하세요."
      />
      <main className="flex-1 p-4 sm:p-6">
        <MeetingSummarizer />
      </main>
    </div>
  );
}
