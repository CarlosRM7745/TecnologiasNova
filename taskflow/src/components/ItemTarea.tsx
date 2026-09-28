//Carlos Rodriguez - SJ
import type { FC } from 'react';
import type { Todo } from '../interfaces/todo';

interface Props {
  todo: Todo;
  onAlternar: (id: string) => void;
  onEliminar: (id: string) => void;
}

export const ItemTarea: FC<Props> = ({ todo, onAlternar, onEliminar }) => (
  <li className={`item-tarea ${todo.status ? 'completada' : ''}`}>
    <input
      type="checkbox"
      checked={todo.status}
      onChange={() => onAlternar(todo.id)}
    />
    <span>{todo.descripcion}</span>
    <button onClick={() => onEliminar(todo.id)}>✕</button>
  </li>
);