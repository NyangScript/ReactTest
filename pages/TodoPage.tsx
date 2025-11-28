
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import PlusIcon from '../components/icons/PlusIcon';
import TrashIcon from '../components/icons/TrashIcon';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'React 공부하기', completed: true },
    { id: 2, text: '대시보드 프로젝트 완성', completed: false },
  ]);
  const [input, setInput] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="p-6 bg-brand-dark/50 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-white">할 일 목록 (To-Do)</h1>
          <p className="text-slate-400 text-sm">오늘 해야 할 일을 관리하세요.</p>
        </div>

        <div className="p-6">
          <form onSubmit={addTodo} className="flex gap-2 mb-6">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="새로운 할 일을 입력하세요..."
              className="flex-grow bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-brand-primary focus:outline-none"
            />
            <button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white p-3 rounded-lg transition-colors">
              <PlusIcon className="w-6 h-6" />
            </button>
          </form>

          <ul className="space-y-3">
            {todos.map(todo => (
              <li 
                key={todo.id} 
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  todo.completed ? 'bg-slate-700/30' : 'bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 flex-grow cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    todo.completed ? 'bg-green-500 border-green-500' : 'border-slate-500'
                  }`}>
                    {todo.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className={`${todo.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {todo.text}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="text-slate-400 hover:text-red-400 transition-colors p-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
            {todos.length === 0 && (
              <li className="text-center text-slate-500 py-8">할 일이 없습니다. 새로운 목표를 추가해보세요!</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>대시보드로 돌아가기</span>
        </Link>
      </div>
    </div>
  );
};

export default TodoPage;
