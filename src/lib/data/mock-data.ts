export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export const mockTasks: Task[] = [
  {
    id: '1',
    text: 'Finalize the Q3 financial report',
    completed: false,
    dueDate: 'Tomorrow',
  },
  {
    id: '2',
    text: 'Prepare presentation for the weekly sync',
    completed: false,
    dueDate: '2 days',
  },
  {
    id: '3',
    text: 'Review pull request from the frontend team',
    completed: true,
  },
  {
    id: '4',
    text: 'Book hotel and flights for the Denver conference',
    completed: false,
  },
  {
    id: '5',
    text: 'Follow up with legal on the new vendor contract',
    completed: false,
    dueDate: 'Friday',
  },
  {
    id: '6',
    text: 'Onboard the new marketing intern',
    completed: true,
  },
];
