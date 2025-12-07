type StatusType = "todo" | "ongoing" | "done";

export interface Task {
  id: string;
  text: string;
  status: StatusType;
  createdAt?: string;
  createdBy: string;
  updatedAt?: string;
}
