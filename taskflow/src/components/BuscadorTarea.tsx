//Carlos Rodriguez - SJ
import type { FC } from 'react';

interface Props {
  valor: string;
  onBuscar: (texto: string) => void;
}

export const BuscadorTarea: FC<Props> = ({ valor, onBuscar }) => (
  <div className="buscador-tarea">
    <input
      type="text"
      value={valor}
      placeholder=" Buscar tarea por nombre..."
      onChange={(e) => onBuscar(e.target.value)}
    />
  </div>
);