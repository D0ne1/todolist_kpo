import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, User, Plus } from 'lucide-react';
import UserModal from './UserModal';

const Header: React.FC = () => {
  const { currentUser, toggleTheme, theme } = useApp();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">✓</span>
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">TodoApp</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun size={20} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>
          
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="User settings"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-lg">
              {currentUser?.avatar || <User size={18} />}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentUser?.name || 'User'}
            </span>
          </button>
        </div>
      </div>
      
      {isUserModalOpen && (
        <UserModal onClose={() => setIsUserModalOpen(false)} />
      )}
    </header>
  );
};

export default Header;