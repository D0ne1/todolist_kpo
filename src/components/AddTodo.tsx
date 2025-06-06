import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext'; // путь поправь под свой проект

const AddTodo: React.FC = () => {
  const { categories,  addTodo } = useApp();
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoryId(categories[0].id);
    } else {
      setCategoryId('');
    }
  }, [categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !categoryId) return;
    setLoading(true);
    setErrorMsg('');

    try {
      await addTodo(text.trim(), categoryId);
      setText('');
      setIsExpanded(false);
    } catch (err) {
      setErrorMsg('Ошибка при добавлении задачи');
    } finally {
      setLoading(false);
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400">
        Нет доступных категорий. Сначала создайте категорию.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 mb-6">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-indigo-600 dark:text-indigo-400 mr-3">
            +
          </div>
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (!isExpanded && e.target.value) setIsExpanded(true);
            }}
            onFocus={() => setIsExpanded(true)}
            placeholder="Добавить новую задачу..."
            className="flex-grow py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            disabled={loading}
          />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-wrap items-center justify-between">
            <div className="mb-2 sm:mb-0 w-full sm:w-auto">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Категория
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-white dark:bg-gray-700 
                  border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                  text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 dark:focus:ring-indigo-400"
                disabled={loading}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2 mt-3 sm:mt-0">
              <button
                type="button"
                onClick={() => {
                  setText('');
                  setIsExpanded(false);
                  setErrorMsg('');
                }}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                  bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 
                  dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!text.trim() || !categoryId || loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md
                  ${text.trim() && categoryId && !loading
                    ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600' 
                    : 'bg-indigo-400 cursor-not-allowed'
                  } transition-colors duration-200`}
              >
                {loading ? 'Добавление...' : 'Добавить задачу'}
              </button>
            </div>
          </div>
          {errorMsg && (
            <div className="text-red-600 dark:text-red-400 text-sm mt-2">{errorMsg}</div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddTodo;