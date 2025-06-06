import React, { useState, useMemo } from 'react';
import TodoItem from './TodoItem';
import { Filter, SortDesc, SortAsc, ListFilter, Check, CheckCheck, X } from 'lucide-react';
import { getCompletedTodosCount, getTotalTodosCount, getCompletionRate } from '../utils/helpers';

type SortOption = 'newest' | 'oldest' | 'alphabetical';
type FilterOption = 'all' | 'completed' | 'active';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  categoryId: string;
  createdAt: number;
  userId: string;
}
interface Category {
  id: string;
  name: string;
  color: string;
}
interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface TodoListProps {
  todos?: Todo[];
  categories?: Category[];
  currentUser: User | null;
  onToggle: (id: string) => Promise<void>;
  onUpdate: (id: string, newText: string, newCategoryId: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TodoList: React.FC<TodoListProps> = ({
  todos = [],
  categories = [],
  currentUser,
  onToggle,
  onUpdate,
  onDelete,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Фильтр тодо для текущего пользователя
  const userTodos = useMemo(() => {
    if (!currentUser) return [];
    return (todos ?? []).filter(todo => todo.userId === currentUser.id);
  }, [todos, currentUser]);

  // Применяйте фильтры и сортировку
  const filteredAndSortedTodos = useMemo(() => {
    let filtered = [...userTodos];

    // Фильтр по состоянию
    if (filterStatus === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    } else if (filterStatus === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    }

    // Фильтр по категориям
    if (filterCategory !== 'all') {
      filtered = filtered.filter(todo => todo.categoryId === filterCategory);
    }

    // Сортировка
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.createdAt - a.createdAt;
      } else if (sortBy === 'oldest') {
        return a.createdAt - b.createdAt;
      } else if (sortBy === 'alphabetical') {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });
  }, [userTodos, filterStatus, filterCategory, sortBy]);

  // Рассчитать статистику
  const totalTodos = getTotalTodosCount(userTodos);
  const completedTodos = getCompletedTodosCount(userTodos);
  const completionRate = getCompletionRate(userTodos);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Статистика */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 border-b border-indigo-100 dark:border-indigo-900/30">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Все</p>
            <p className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">{totalTodos}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Завершённые</p>
            <p className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">{completedTodos}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Прогресс</p>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">{completionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* События */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 
              bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 
              dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle filters"
          >
            <Filter size={16} className="mr-1" />
            Фильтры
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center p-1.5 text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
            aria-label={sortBy === 'newest' ? 'Sort by oldest' : 'Sort by newest'}
            title={sortBy === 'newest' ? 'Newest first' : 'Oldest first'}
          >
            {sortBy === 'newest' ? <SortDesc size={16} /> : <SortAsc size={16} />}
          </button>
          <button
            onClick={() => setSortBy('alphabetical')}
            className={`flex items-center p-1.5 rounded-md transition-colors duration-200
              ${sortBy === 'alphabetical' 
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            aria-label="Sort alphabetically"
            title="Sort alphabetically"
          >
            <ListFilter size={16} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <div className={`bg-gray-50 dark:bg-gray-700/30 p-4 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden
        ${showFilters ? 'max-h-36' : 'max-h-0 p-0 border-b-0'}`}>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Статус
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors
                  ${filterStatus === 'all' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                Все
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center
                  ${filterStatus === 'active' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                <X size={10} className="mr-1" /> Активные
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center
                  ${filterStatus === 'completed' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                <Check size={10} className="mr-1" /> Завершённые
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Категория
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 text-sm bg-white dark:bg-gray-700 
                border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 
                focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              <option value="all">Все категории</option>
              {(categories ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="p-4">
        {filteredAndSortedTodos.length > 0 ? (
          <div className="space-y-2">
            {filteredAndSortedTodos.map(todo => (
              <TodoItem 
                key={todo.id}
                id={todo.id}
                text={todo.text}
                completed={todo.completed}
                categoryId={todo.categoryId}
                createdAt={todo.createdAt}
                categories={categories ?? []}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <CheckCheck size={24} className="text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">Задач не найдено</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {totalTodos > 0 
                ? 'Меняйте фильтры, чтобы увидеть больше задач'
                : 'Добавьте свое первое задание, используя форму выше'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;