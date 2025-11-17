export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export const mockTasks: Task[] = [
  {
    id: '1',
    text: '3분기 재무 보고서 최종 마무리',
    completed: false,
    dueDate: '내일',
  },
  {
    id: '2',
    text: '주간 동기화를 위한 프레젠테이션 준비',
    completed: false,
    dueDate: '2일 후',
  },
  {
    id: '3',
    text: '프론트엔드 팀의 풀 리퀘스트 검토',
    completed: true,
  },
  {
    id: '4',
    text: '덴버 컨퍼런스를 위한 호텔 및 항공편 예약',
    completed: false,
  },
  {
    id: '5',
    text: '새로운 공급업체 계약에 대해 법무팀과 후속 조치',
    completed: false,
    dueDate: '금요일',
  },
  {
    id: '6',
    text: '새로운 마케팅 인턴 온보딩',
    completed: true,
  },
];
