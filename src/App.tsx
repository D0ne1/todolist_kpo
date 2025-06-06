import React, { useState } from 'react';
import Header from './components/Header';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import CategoryManager from './components/CategoryManager';
import UserRegister from './components/UserRegister';
import UserModal from './components/UserModal';
import { AppProvider, useApp } from './context/AppContext';

const MainContent: React.FC = () => {
  const {
    currentUser, users, selectUser,
    toggleTodo, updateTodo, deleteTodo
  } = useApp();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        {showRegister ? (
          <UserRegister onClose={() => setShowRegister(false)} />
        ) : (
          <UserModal
            users={users}
            currentUser={null}
            onSelectUser={(id) => selectUser(id)}
            onClose={() => {}}
            onGoToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AddTodo />
            <TodoList
              currentUser={currentUser}
              onToggle={toggleTodo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          </div>
          <div className="lg:col-span-1">
            <CategoryManager />
          </div>
        </div>
      </main>
      {showUserModal && (
        <UserModal
          users={users}
          currentUser={currentUser}
          onSelectUser={(id) => {
            selectUser(id);
            setShowUserModal(false);
          }}
          onClose={() => setShowUserModal(false)}
          onGoToRegister={() => {
            setShowUserModal(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <UserRegister onClose={() => setShowRegister(false)} />
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;