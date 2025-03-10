export interface Task {
  id: string;
  name: string;
  done: boolean;
  createdAt: Date;
  doneAt: Date | null;
  deleted: boolean;
}
