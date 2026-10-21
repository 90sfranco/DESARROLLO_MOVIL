import { createContext, useState } from 'react';

export const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  function addTask(title, description) {
    const task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
    };
    setTasks((currentTasks) => [...currentTasks, task]);
  }

  function editTask(id, title, description) {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === id ? { ...task, title: title.trim(), description: description.trim() } : task
    )));
  }

  function toggleTask(id) {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === id ? { ...task, completed: !task.completed } : task
    )));
  }

  function deleteTask(id) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  return (
    <TasksContext.Provider value={{ tasks, addTask, editTask, toggleTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
}
