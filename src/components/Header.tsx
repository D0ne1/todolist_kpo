import React, { useState } from 'react';
import { Moon, Sun, User } from 'lucide-react';
import UserModal from './UserModal';
import UserRegister from './UserRegister';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const {
    currentUser,
    theme,
    toggleTheme,
    users,
    selectUser,
  } = useApp();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">✓</span>
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Todo App</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label={theme === 'light' ? 'Переключение в темный режим' : 'Переключение на светлый режим'}
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
              {currentUser?.avatar ? (
                typeof currentUser.avatar === 'string' && currentUser.avatar.startsWith('http') ? (
                  <img src={currentUser.avatar} alt="avatar" className="rounded-full w-8 h-8" />
                ) : (
                  <span>{currentUser.avatar}</span>
                )
              ) : (
                <User size={18} />
              )}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentUser?.name || 'User'}
            </span>
          </button>
        </div>
      </div>
      {isUserModalOpen && (
        <UserModal
          users={users}
          currentUser={currentUser}
          onSelectUser={(id) => {
            selectUser(id);
            setIsUserModalOpen(false);
          }}
          onClose={() => setIsUserModalOpen(false)}
          onGoToRegister={() => {
            setIsUserModalOpen(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <UserRegister onClose={() => setShowRegister(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;