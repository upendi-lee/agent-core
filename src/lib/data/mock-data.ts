export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export const mockTasks: Task[] = [
  {
    id: '1',
    text: '3분기 재무 보고서 마무리하기',
    completed: false,
    dueDate: '내일',
  },
  {
    id: '2',
    text: '주간 동기화 회의 발표 자료 준비',
    completed: false,
    dueDate: '2일 후',
  },
  {
    id: '3',
    text: '프론트엔드 팀의 코드 리뷰하기',
    completed: true,
  },
  {
    id: '4',
    text: '부산 출장 호텔 및 KTX 예약하기',
    completed: false,
  },
  {
    id: '5',
    text: '새로운 협력업체 계약 건에 대해 법무팀과 확인하기',
    completed: false,
    dueDate: '금요일',
  },
  {
    id: '6',
    text: '새로운 마케팅 인턴 온보딩 진행',
    completed: true,
  },
];
