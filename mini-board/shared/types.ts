export interface Board {
  id: string;
  name: string;
  createdAt: string; // ISO date
}

export interface Group {
  id: string;
  name: string;
  order: number;
  boardId: string;
}

export interface Item {
  id: string;
  title: string;
  description?: string | null;
  statusLabel: string;
  statusColor: string;
  assignee?: string | null;
  notes?: string | null;
  position: number;
  groupId: string;
  boardId: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  statusChangedAt?: string | null;
}
