import { PageHeader } from '@/components/page-header';
import { TodoList } from '@/components/todo-list';

export default function TasksPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="To-Do List"
        description="Organize and manage your tasks."
      />
      <main className="flex-1 p-4 sm:p-6">
        <TodoList />
      </main>
    </div>
  );
}
