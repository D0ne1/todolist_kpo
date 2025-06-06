export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getCompletedTodosCount = (todos: { completed: boolean }[]): number => {
  return todos.filter(todo => todo.completed).length;
};

export const getTotalTodosCount = (todos: unknown[]): number => {
  return todos.length;
};

export const getCompletionRate = (todos: { completed: boolean }[]): number => {
  if (todos.length === 0) return 0;
  return Math.round((getCompletedTodosCount(todos) / todos.length) * 100);
};