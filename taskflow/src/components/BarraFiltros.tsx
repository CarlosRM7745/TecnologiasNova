//Carlos Rodriguez - SJ
import type { FC } from 'react';
import type { Filtro } from '../interfaces/todo';

interface Props {
  filtro: Filtro;
  onCambiar: (f: Filtro) => void;
  pendientes: number;
}

const opciones: Filtro[] = ['todas', 'activas', 'finalizadas'];

export const BarraFiltros: FC<Props> = ({ filtro, onCambiar, pendientes }) => (
  <div className="barra-filtros">
    <span className="contador">{pendientes} pendientes</span>
    <div className="filtros">
      {opciones.map((op) => (
        <button
          key={op}
          className={filtro === op ? 'activo' : ''}
          onClick={() => onCambiar(op)}
        >
          {op}
        </button>
      ))}
    </div>
  </div>
);