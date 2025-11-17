import { PageHeader } from '@/components/page-header';
import { MeetingSummarizer } from '@/components/meeting-summarizer';

export default function MeetingsPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="AI-Powered Meeting Summary"
        description="Record or upload meeting audio to get summaries and action items."
      />
      <main className="flex-1 p-4 sm:p-6">
        <MeetingSummarizer />
      </main>
    </div>
  );
}
