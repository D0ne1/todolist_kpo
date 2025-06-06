import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const DEFAULT_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=cat",
  "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=dog",
  "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=fox",
  "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=duck",
];

interface UserRegisterProps {
  onClose?: () => void;
}

const UserRegister: React.FC<UserRegisterProps> = ({ onClose }) => {
  const { addUser, fetchUsers } = useApp();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(DEFAULT_AVATARS[0]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);
    if (!name.trim()) {
      setErrorMsg('Введите имя');
      return;
    }
    setLoading(true);
    try {
      await addUser(name.trim(), avatar);
      setSuccess(true);
      setName('');
      setAvatar(DEFAULT_AVATARS[0]);
      await fetchUsers();
      // После успешной регистрации можно сразу закрыть окно, если onClose передали
      if (onClose) onClose();
    } catch (e: any) {
      setErrorMsg(e.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-10">
      <h2 className="text-xl font-bold mb-4 text-center text-indigo-700 dark:text-indigo-300">Регистрация пользователя</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">Имя</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Введите ваше имя"
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">Аватар</label>
          <div className="flex gap-3 flex-wrap">
            {DEFAULT_AVATARS.map(url => (
              <button
                key={url}
                type="button"
                onClick={() => setAvatar(url)}
                className={`rounded-full w-12 h-12 p-1 border-2 ${avatar === url ? "border-indigo-500" : "border-transparent"}`}
                disabled={loading}
              >
                <img src={url} alt="avatar" className="rounded-full w-10 h-10" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
          {onClose && (
            <button
              type="button"
              className="w-full py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-md transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              Назад
            </button>
          )}
        </div>
        {errorMsg && <div className="text-red-500 text-sm mt-2">{errorMsg}</div>}
        {success && <div className="text-green-600 text-sm mt-2">Пользователь успешно зарегистрирован!</div>}
      </form>
    </div>
  );
};

export default UserRegister;