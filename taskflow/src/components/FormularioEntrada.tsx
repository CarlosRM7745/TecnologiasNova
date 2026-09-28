//Carlos Rodriguez - SJ
import { useState, type FC } from 'react';

interface Props { onAgregar: (texto: string) => void; }

export const FormularioEntrada: FC<Props> = ({ onAgregar }) => {
  const [texto, setTexto] = useState('');

  const enviar = () => {
    if (texto.trim().length === 0) return;
    onAgregar(texto.trim());
    setTexto('');
  };

  return (
    <div className="form-entrada">
      <input
        value={texto}
        placeholder="Nueva tarea..."
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && enviar()}
      />
      <button onClick={enviar}>Agregar</button>
    </div>
  );
};