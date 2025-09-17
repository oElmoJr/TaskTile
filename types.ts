// Tipagem para os blocos
export interface Block {
  id: string;
  title: string;
  type: 'pomodoro' | 'task' | 'note' | 'goal' | 'project' | 'journal';
}
