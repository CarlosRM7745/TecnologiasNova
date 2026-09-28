//Carlos Rodriguez - SJ
import type { Filtro, Todo } from '../interfaces/todo';

export const filtrarTodos = (
  todos: Todo[],
  filtro: Filtro,
  busqueda: string
): Todo[] => {
  const q = busqueda.trim().toLowerCase();
  return todos.filter((t) => {
    const porEstado =
      filtro === 'activas' ? !t.status
      : filtro === 'finalizadas' ? t.status
      : true;
    const porTexto = q.length === 0 || t.descripcion.toLowerCase().includes(q);
    return porEstado && porTexto;
  });
};