import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Todo, Category, User } from '../types';

interface AppContextType {
  todos: Todo[];
  categories: Category[];
  users: User[];
  currentUser: User | null;
  theme: 'light' | 'dark';
  addTodo: (text: string, categoryId: string) => Promise<void>;
  updateTodo: (id: string, text: string, categoryId: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  addCategory: (name: string, color: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addUser: (name: string, avatar: string) => Promise<void>;
  selectUser: (id: string) => void;
  toggleTheme: () => void;
  fetchUsers: () => Promise<void>;
  updateCategory: (id: string, name: string, color: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Загрузка пользователей
  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/users');
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    // Автоматический выбор первого пользователя
    if ((!currentUser || !data.some((u: User) => u.id === currentUser.id)) && data.length > 0) {
      setCurrentUser(data[0]);
    }
  };

  // Загрузка категорий
  const fetchCategories = async () => {
    const res = await fetch('http://localhost:5000/categories');
    const data = await res.json();
    setCategories(Array.isArray(data) ? [...data] : []);
  };

  // Загрузка задач
  const fetchTodos = async (userId?: string) => {
    let url = 'http://localhost:5000/todos';
    if (userId) url += `?user_id=${userId}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log('todos from server:', data); // смотри в консоль что реально приходит
    const mapped = Array.isArray(data)
      ? data.map((t: any) => ({
          id: t.id,
          text: t.text,
          completed: t.completed,
          categoryId: t.category_id, // маппинг!
          createdAt: t.created_at ? new Date(t.created_at).getTime() : Date.now(),
          userId: t.user_id, // маппинг!
        }))
      : [];
    setTodos(mapped);
    console.log('todos after mapping:', mapped); // смотри что реально уходит в стейт
  };

  // Получение данных при монтировании
  useEffect(() => {
    fetchUsers();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  // Загружать задачи, когда выбран пользователь меняется
  useEffect(() => {
    if (currentUser?.id) fetchTodos(currentUser.id);
  }, [currentUser]);

  // CRUD действия
  const addTodo = async (text: string, categoryId: string) => {
    if (!currentUser) return;
    const res = await fetch('http://localhost:5000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        category_id: categoryId,
        user_id: currentUser.id,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('Ошибка добавления задачи:', data);
      return;
    }
    await fetchTodos(currentUser.id);
  };

  const updateTodo = async (id: string, text: string, categoryId: string) => {
    if (!currentUser) return;
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, category_id: categoryId }),
    });
    await fetchTodos(currentUser.id);
  };

  const toggleTodo = async (id: string) => {
    if (!currentUser) return;
    await fetch(`http://localhost:5000/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    await fetchTodos(currentUser.id);
  };

  const deleteTodo = async (id: string) => {
    if (!currentUser) return;
    await fetch(`http://localhost:5000/todos/${id}`, { method: 'DELETE' });
    await fetchTodos(currentUser.id);
  };

  const addCategory = async (name: string, color: string) => {
    await fetch('http://localhost:5000/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });
    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    await fetch(`http://localhost:5000/categories/${id}`, { method: 'DELETE' });
    await fetchCategories();
  };

  const addUser = async (name: string, avatar: string) => {
    await fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, avatar }),
    });
    await fetchUsers();
  };

  const updateCategory = async (id: string, name: string, color: string) => {
    await fetch(`http://localhost:5000/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });
    await fetchCategories();
  };

  const selectUser = (id: string) => {
    const user = users.find(u => u.id === id) || null;
    setCurrentUser(user);
    if (user) fetchTodos(user.id);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'light');
    }
  };

  return (
    <AppContext.Provider
      value={{
        todos,
        categories,
        users,
        currentUser,
        theme,
        addTodo,
        updateTodo,
        toggleTodo,
        deleteTodo,
        addCategory,
        deleteCategory,
        addUser,
        selectUser,
        toggleTheme,
        fetchUsers, 
        updateCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp должен использоваться внутри AppProvider');
  return context;
};