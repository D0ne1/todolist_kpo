import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Pencil, Trash2, X, Check, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/helpers';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  categoryId: string;
  createdAt: number;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, text, completed, categoryId, createdAt }) => {
  const { toggleTodo, updateTodo, deleteTodo, categories } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [editCategoryId, setEditCategoryId] = useState(categoryId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const category = categories.find(cat => cat.id === categoryId);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim()) {
      updateTodo(id, editText, editCategoryId);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(text);
      setEditCategoryId(categoryId);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteTodo(id);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className={`group border dark:border-gray-700 rounded-lg mb-2 overflow-hidden transition-all duration-300 
      ${completed ? 'bg-gray-50 dark:bg-gray-800/40' : 'bg-white dark:bg-gray-800'}`}>
      <div className="flex items-center p-3 relative">
        {/* Category indicator */}
        <div 
          className="w-1 self-stretch mr-3 rounded-full" 
          style={{ backgroundColor: category?.color || '#CBD5E1' }}
        />
        
        {/* Checkbox */}
        <div className="mr-3 flex-shrink-0">
          <button
            onClick={() => toggleTodo(id)}
            className={`w-5 h-5 flex items-center justify-center rounded-full border 
              ${completed 
                ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500' 
                : 'border-gray-300 dark:border-gray-600'} 
              transition-colors duration-200`}
            aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {completed && (
              <Check size={12} className="text-white" />
            )}
          </button>
        </div>
        
        {/* Todo content */}
        {isEditing ? (
          <div className="flex-grow flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <select
              value={editCategoryId}
              onChange={(e) => setEditCategoryId(e.target.value)}
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              onClick={handleSave}
              className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 transition-colors"
              aria-label="Save"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setEditText(text);
                setEditCategoryId(categoryId);
                setIsEditing(false);
              }}
              className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex-grow min-w-0">
            <p className={`text-sm text-gray-800 dark:text-gray-200 break-words ${completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
              {text}
            </p>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className="inline-flex items-center mr-3">
                <span className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: category?.color }} />
                {category?.name || 'Uncategorized'}
              </span>
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        )}
        
        {/* Actions */}
        {!isEditing && (
          <div className={`flex space-x-1 ${showDeleteConfirm ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}>
            {showDeleteConfirm ? (
              <>
                <button
                  onClick={handleDelete}
                  className="p-1 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
                  aria-label="Confirm delete"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Cancel delete"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Edit todo"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Delete todo"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;