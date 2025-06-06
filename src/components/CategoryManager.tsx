import React, { useState } from 'react';
import { PlusCircle, Trash2, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CategoryManager: React.FC = () => {
  const { categories, addCategory, deleteCategory, todos, updateCategory } = useApp() as any;
  // updateCategory должен быть реализован в AppContext!

  const [showForm, setShowForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#4F46E5');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Для редактирования
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#4F46E5');

  const colorOptions = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6',
  ];

  const getCategoryTodosCount = (categoryId: string) =>
    todos.filter((todo: any) => todo.categoryId === categoryId).length;

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await addCategory(newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setShowForm(false);
    } catch (e: any) {
      setErrorMsg(e.message || 'Ошибка при добавлении категории');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await deleteCategory(categoryId);
    } catch (e: any) {
      setErrorMsg(e.message || 'Ошибка при удалении категории');
    } finally {
      setLoading(false);
    }
  };

  // Редактирование
  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
    setErrorMsg('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('#4F46E5');
    setErrorMsg('');
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editingId) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await updateCategory(editingId, editName.trim(), editColor);
      cancelEdit();
    } catch (e: any) {
      setErrorMsg(e.message || 'Ошибка при редактировании категории');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Категории</h2>
      {errorMsg && (
        <div className="text-red-600 dark:text-red-400 text-sm mb-2">{errorMsg}</div>
      )}

      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
        {categories.map((category: any) => {
          const todosCount = getCategoryTodosCount(category.id);
          const canDelete = todosCount === 0;

          // Если сейчас редактируем именно эту категорию
          if (editingId === category.id) {
            return (
              <form
                key={category.id}
                onSubmit={handleEditCategory}
                className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-700/40"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex gap-1">
                    {colorOptions.map(color => (
                      <div
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={`w-4 h-4 rounded-full cursor-pointer ${editColor === color ? 'ring-2 ring-indigo-600' : ''}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Выбрать цвет ${color}`}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
                    disabled={loading}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    type="submit"
                    disabled={loading || !editName.trim()}
                    className="px-2 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-2 py-1 text-xs rounded bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            );
          }

          // Отображение категории по умолчанию
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
                <span className="text-xs text-gray-500 dark:text-gray-400">{todosCount} задачи</span>
                <button
                  onClick={() => startEdit(category)}
                  className="p-1 rounded-full text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  aria-label={`Редактировать ${category.name}`}
                  disabled={loading}
                >
                  <Pencil size={14} />
                </button>
                {canDelete && (
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={loading}
                    className="p-1 rounded-full text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={`Удалить категорию ${category.name}`}
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
              Название категории
            </label>
            <input
              type="text"
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Введите название"
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Цвет категории
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
                setErrorMsg('');
              }}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 
                bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 
                dark:hover:bg-gray-500 transition-colors duration-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!newCategoryName.trim() || loading}
              className={`px-3 py-1.5 text-xs font-medium text-white rounded-md
                ${newCategoryName.trim() && !loading
                  ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600' 
                  : 'bg-indigo-400 cursor-not-allowed'
                } transition-colors duration-200`}
            >
              {loading ? 'Добавление...' : 'Добавить категорию'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          disabled={loading}
          className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-indigo-600 
            dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-md hover:bg-indigo-100 
            dark:hover:bg-indigo-900/40 transition-colors duration-200"
        >
          <PlusCircle size={16} className="mr-2" />
          Добавить новую категорию
        </button>
      )}
    </div>
  );
};

export default CategoryManager;