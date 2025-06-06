import React from 'react';
import { X, UserPlus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
}
interface UserModalProps {
  onClose: () => void;
  users: User[];
  currentUser: User | null;
  onSelectUser: (userId: string) => void;
  onGoToRegister: () => void;
}

const UserModal: React.FC<UserModalProps> = ({
  onClose,
  users,
  currentUser,
  onSelectUser,
  onGoToRegister,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 transition-all duration-300 transform"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Выберите пользователя</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {users.length === 0 && (
              <div className="text-gray-600 dark:text-gray-300 py-6 text-center">
                Нет зарегистрированных пользователей
              </div>
            )}
            {users.map(user => (
              <button 
                key={user.id}
                onClick={() => { onSelectUser(user.id); onClose(); }}
                className={`w-full flex items-center space-x-3 p-3 rounded-md transition-colors duration-200 text-left ${
                  currentUser?.id === user.id 
                    ? 'bg-indigo-100 dark:bg-indigo-900/40' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/40'
                }`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-xl">
                  <img src={user.avatar} alt="avatar" className="rounded-full w-10 h-10 object-cover" />
                </div>
                <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                {currentUser?.id === user.id && (
                  <span className="ml-auto text-xs text-indigo-600 dark:text-indigo-400">Вы</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => { onClose(); onGoToRegister(); }}
            className="mt-6 flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-indigo-600 
              dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-md hover:bg-indigo-100 
              dark:hover:bg-indigo-900/40 transition-colors duration-200"
          >
            <UserPlus size={16} className="mr-2" />
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;