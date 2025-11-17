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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import { mockTasks, type Task } from '@/lib/data/mock-data';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

export function TodoList() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const newTaskItem: Task = {
      id: String(Date.now()),
      text: newTask,
      completed: false,
    };
    setTasks([newTaskItem, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
        <CardDescription>
          Add, manage, and complete your tasks for the day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="e.g., Follow up on sales leads"
          />
          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </form>
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">To-Do</h3>
          <div className="space-y-2">
            {incompleteTasks.length > 0 ? (
              incompleteTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-3 rounded-md p-2 hover:bg-muted"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={cn(
                      'flex-1 cursor-pointer text-sm',
                      task.completed ? 'text-muted-foreground line-through' : ''
                    )}
                  >
                    {task.text}
                  </label>
                  {task.dueDate && (
                    <Badge variant="outline">{task.dueDate}</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="p-2 text-sm text-muted-foreground">
                All tasks completed!
              </p>
            )}
          </div>
          {completedTasks.length > 0 && (
            <>
              <Separator className="my-4" />
              <h3 className="text-lg font-semibold">Completed</h3>
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-center gap-3 rounded-md p-2 hover:bg-muted"
                  >
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className="flex-1 cursor-pointer text-sm text-muted-foreground line-through"
                    >
                      {task.text}
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
