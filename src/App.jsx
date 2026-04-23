import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, LayoutList } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  });
  
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTask = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false
    };
    
    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="app-container">
      <div className="header">
        <h1>Nova Tasks</h1>
        <p>Your premium day planner</p>
      </div>

      <div className="glass-panel">
        <form className="input-group" onSubmit={addTask}>
          <input
            type="text"
            className="task-input"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button 
            type="submit" 
            className="add-btn"
            disabled={!inputValue.trim()}
          >
            <Plus size={24} />
          </button>
        </form>

        <div className="tasks-container">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <LayoutList size={48} />
              <p>No tasks yet. Add one above to get started!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-content" onClick={() => toggleTask(task.id)} style={{ cursor: 'pointer' }}>
                  <div className={`checkbox ${task.completed ? 'checked' : ''}`}>
                    {task.completed && <Check size={16} color="white" />}
                  </div>
                  <span className="task-text">{task.text}</span>
                </div>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  aria-label="Delete task"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {tasks.length > 0 && (
          <div className="stats">
            <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total</span>
            <span>{completedCount} completed</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
