import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, Trash2, X } from 'lucide-react';

const CategoryManager: React.FC = () => {
  const { categories, addCategory, deleteCategory, todos } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#4F46E5');

  const colorOptions = [
    '#4F46E5', // Indigo
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#14B8A6', // Teal
  ];

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setShowForm(false);
    }
  };

  // Calculate todos count per category
  const getCategoryTodosCount = (categoryId: string) => {
    return todos.filter(todo => todo.categoryId === categoryId).length;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Categories</h2>
      
      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
        {categories.map(category => {
          const todosCount = getCategoryTodosCount(category.id);
          const canDelete = todosCount === 0;
          
          return (
            <div 
              key={category.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-800 dark:text-gray-200">{category.name}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">{todosCount} tasks</span>
                
                {canDelete && (
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={`Delete ${category.name} category`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {showForm ? (
        <form onSubmit={handleAddCategory} className="bg-gray-50 dark:bg-gray-700/40 p-3 rounded-md">
          <div className="mb-3">
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter category name"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <div
                  key={color}
                  onClick={() => setNewCategoryColor(color)}
                  className={`w-6 h-6 rounded-full cursor-pointer ${
                    newCategoryColor === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setNewCategoryName('');
                setShowForm(false);
              }}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 
                bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 
                dark:hover:bg-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newCategoryName.trim()}
              className={`px-3 py-1.5 text-xs font-medium text-white rounded-md
                ${newCategoryName.trim() 
                  ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600' 
                  : 'bg-indigo-400 cursor-not-allowed'
                } transition-colors duration-200`}
            >
              Add Category
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-indigo-600 
            dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-md hover:bg-indigo-100 
            dark:hover:bg-indigo-900/40 transition-colors duration-200"
        >
          <PlusCircle size={16} className="mr-2" />
          Add New Category
        </button>
      )}
    </div>
  );
};

export default CategoryManager;