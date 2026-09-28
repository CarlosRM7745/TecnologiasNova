//Carlos Rodriguez - SJ
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { Todo } from '../interfaces/todo';
import { cargarTodos, guardarTodos } from '../utils/storage';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(cargarTodos);

  useEffect(() => { guardarTodos(todos); }, [todos]);

  const agregar = (descripcion: string) =>
    setTodos([...todos, { id: uuid(), descripcion, status: false }]);

  const alternar = (id: string) =>
    setTodos(todos.map(t => (t.id === id ? { ...t, status: !t.status } : t)));

  const eliminar = (id: string) =>
    setTodos(todos.filter(t => t.id !== id));

  return { todos, agregar, alternar, eliminar };
};