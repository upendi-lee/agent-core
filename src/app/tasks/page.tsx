import { PageHeader } from '@/components/page-header';
import { TodoList } from '@/components/todo-list';

export default function TasksPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="할 일 목록"
        description="작업을 정리하고 관리하세요."
      />
      <main className="flex-1 p-4 sm:p-6">
        <TodoList />
      </main>
    </div>
  );
}
