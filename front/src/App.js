import { useState } from 'react';
import './App.css';

function App() {
  const [texto, setTexto] = useState('');
  const [resposta, setResposta] = useState(null);

  const enviar = async () => {
    const res = await fetch('http://localhost:8080/api/analisar-contrato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto }),
    });

    const data = await res.json();
    setResposta(data);
  };

  return (
    <div>
      <h1>Analisar Contrato</h1>
      <textarea
        rows="10"
        cols="50"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Cole o contrato aqui..."
      />
      <br />
      <button onClick={enviar}>Enviar</button>

      {resposta && (
        <div>
          <h2>Resultado:</h2>
          <pre>{JSON.stringify(resposta, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
