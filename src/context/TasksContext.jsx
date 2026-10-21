import { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { NetworkContext } from './NetworkContext.jsx';
import useRealTimeCollection from '../hooks/useRealTimeCollection.js';

export const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { isOnline } = useContext(NetworkContext);
  const collection = useRealTimeCollection(user ? `users/${user.uid}/tasks` : null, isOnline);
  const tasks = collection.results;

  function addTask(title, description) {
    return collection.add({ title: title.trim(), description: description.trim(), completed: false });
  }
  function editTask(id, title, description) {
    return collection.update(id, { title: title.trim(), description: description.trim() });
  }
  function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return false;
    return collection.update(id, { completed: !task.completed });
  }

  return (
    <TasksContext.Provider value={{ tasks, addTask, editTask, toggleTask,
      deleteTask: collection.remove, loading: collection.loading, pending: collection.pending,
      error: collection.error, disabled: !isOnline || collection.loading || collection.pending || !collection.available }}>
      {children}
    </TasksContext.Provider>
  );
}
