import React from 'react';
import Header from './components/Header';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import CategoryManager from './components/CategoryManager';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AddTodo />
              <TodoList />
            </div>
            
            <div className="lg:col-span-1">
              <CategoryManager />
            </div>
          </div>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;