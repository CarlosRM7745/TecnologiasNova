//Carlos Rodriguez - SJ
import { useState } from 'react';
import type { Filtro } from './interfaces/todo';
import { useTodos } from './hooks/useTodos';
import { filtrarTodos } from './utils/filtrar';
import { Header } from './components/Header';
import { FormularioEntrada } from './components/FormularioEntrada';
import { BuscadorTarea } from './components/BuscadorTarea';
import { BarraFiltros } from './components/BarraFiltros';
import { ContenedorLista } from './components/ContenedorLista';

export const App = () => {
  const { todos, agregar, alternar, eliminar } = useTodos();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [busqueda, setBusqueda] = useState('');

  const visibles = filtrarTodos(todos, filtro, busqueda);
  const pendientes = todos.filter((t) => !t.status).length;

  return (
    <main className="app">
      <Header />
      <FormularioEntrada onAgregar={agregar} />
      <BuscadorTarea valor={busqueda} onBuscar={setBusqueda} />
      <BarraFiltros filtro={filtro} onCambiar={setFiltro} pendientes={pendientes} />
      <ContenedorLista todos={visibles} onAlternar={alternar} onEliminar={eliminar} />
    </main>
  );
};