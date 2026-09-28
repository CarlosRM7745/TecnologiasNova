//Carlos Rodriguez - SJ
import type { Todo } from '../interfaces/todo';

const KEY = 'k=todo';

export const guardarTodos = (todos: Todo[]): void => {
  localStorage.setItem(KEY, JSON.stringify(todos));
};

export const cargarTodos = (): Todo[] => {
  const data = localStorage.getItem(KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Todo[];
  } catch {
    return [];
  }
};