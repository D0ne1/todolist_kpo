import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserPlus, X } from 'lucide-react';

interface UserModalProps {
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ onClose }) => {
  const { users, currentUser, selectUser, addUser } = useApp();
  const [newUserName, setNewUserName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👤');
  const [isAddingUser, setIsAddingUser] = useState(false);

  const avatarOptions = ['👤', '👨‍💼', '👩‍💻', '🧑‍💻', '👨‍🎨', '👩‍🎨', '👨‍🚀', '👩‍🚀', '🧙‍♂️', '🧙‍♀️'];

  const handleSelectUser = (userId: string) => {
    selectUser(userId);
    onClose();
  };

  const handleAddUser = () => {
    if (newUserName.trim()) {
      addUser(newUserName.trim(), selectedAvatar);
      setNewUserName('');
      setSelectedAvatar('👤');
      setIsAddingUser(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 transition-all duration-300 transform"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">User Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Select User</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {users.map(user => (
              <div 
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                  currentUser?.id === user.id 
                    ? 'bg-indigo-100 dark:bg-indigo-900/40' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/40'
                }`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-xl">
                  {user.avatar}
                </div>
                <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
              </div>
            ))}
          </div>

          {isAddingUser ? (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-md">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Add New User</h3>
              <div className="mb-3">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="username"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Enter name"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Avatar
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {avatarOptions.map((avatar, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-10 h-10 flex items-center justify-center text-xl rounded-full cursor-pointer 
                        ${selectedAvatar === avatar 
                          ? 'bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500' 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        } transition-all duration-200`}
                    >
                      {avatar}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsAddingUser(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                    bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 
                    dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={!newUserName.trim()}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md
                    ${newUserName.trim() 
                      ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600' 
                      : 'bg-indigo-400 cursor-not-allowed'
                    } transition-colors duration-200`}
                >
                  Add User
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingUser(true)}
              className="mt-4 flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-indigo-600 
                dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-md hover:bg-indigo-100 
                dark:hover:bg-indigo-900/40 transition-colors duration-200"
            >
              <UserPlus size={16} className="mr-2" />
              Add New User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;