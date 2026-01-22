export interface User {
  _id: string;
  email: string;
  fullname: string;
  role: 'client' | 'agent';
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'closed';
  userId: string | User;
  assignedTo?: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  ticketId: string;
  userId: string | User;
  message: string;
  createdAt: string;
}