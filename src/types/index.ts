export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  categoryId: string;
  userId: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}