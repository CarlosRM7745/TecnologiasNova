//Carlos Rodriguez - SJ
import type { FC } from 'react';
import type { Todo } from '../interfaces/todo';
import { ItemTarea } from './ItemTarea';

interface Props {
  todos: Todo[];
  onAlternar: (id: string) => void;
  onEliminar: (id: string) => void;
}

export const ContenedorLista: FC<Props> = ({ todos, onAlternar, onEliminar }) => (
  <ul className="lista-tareas">
    {todos.length === 0 && <li className="vacio">No hay tareas</li>}
    {todos.map((t) => (
      <ItemTarea key={t.id} todo={t} onAlternar={onAlternar} onEliminar={onEliminar} />
    ))}
  </ul>
);