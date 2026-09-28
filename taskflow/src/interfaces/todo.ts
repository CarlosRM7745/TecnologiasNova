//Carlos Rodriguez - SJ
export interface Todo {
  id: string;
  descripcion: string;
  status: boolean; // false = activa, true = finalizada
}

export type Filtro = 'todas' | 'activas' | 'finalizadas';