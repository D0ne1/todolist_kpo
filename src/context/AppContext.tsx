import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Todo, Category, User } from '../types';
import { generateId } from '../utils/helpers';

interface AppContextType {
  todos: Todo[];
  categories: Category[];
  users: User[];
  currentUser: User | null;
  theme: 'light' | 'dark';
  addTodo: (text: string, categoryId: string) => void;
  updateTodo: (id: string, text: string, categoryId: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  addUser: (name: string, avatar: string) => void;
  selectUser: (id: string) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Personal', color: '#4F46E5' },
  { id: 'cat-2', name: 'Work', color: '#10B981' },
  { id: 'cat-3', name: 'Shopping', color: '#F59E0B' },
  { id: 'cat-4', name: 'Urgent', color: '#EF4444' },
];

const defaultUsers: User[] = [
  { id: 'user-1', name: 'John Doe', avatar: '👨‍💼' },
  { id: 'user-2', name: 'Jane Smith', avatar: '👩‍💻' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedCurrentUser = localStorage.getItem('currentUser');
    return savedCurrentUser ? JSON.parse(savedCurrentUser) : users[0];
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const addTodo = (text: string, categoryId: string) => {
    if (!currentUser) return;
    
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      categoryId,
      userId: currentUser.id,
      createdAt: Date.now(),
    };
    
    setTodos([...todos, newTodo]);
  };

  const updateTodo = (id: string, text: string, categoryId: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, text, categoryId } : todo
      )
    );
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: generateId(),
      name,
      color,
    };
    
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id: string) => {
    // Don't delete if there are todos using this category
    if (todos.some(todo => todo.categoryId === id)) {
      return;
    }
    
    setCategories(categories.filter(category => category.id !== id));
  };

  const addUser = (name: string, avatar: string) => {
    const newUser: User = {
      id: generateId(),
      name,
      avatar,
    };
    
    setUsers([...users, newUser]);
  };

  const selectUser = (id: string) => {
    const user = users.find(user => user.id === id) || null;
    setCurrentUser(user);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};