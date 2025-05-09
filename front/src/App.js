import React, {useState} from "react";
import "./App.css";

function App(){
  const [clausula, setClausula] = useState("");
  const [resposta, setResposta] = useState("");

  return(
    <div className="container">
      <h1>JurisIA</h1>


      <textarea
      className="inputSubmit"
      placeholder="Insira um texto para análise"
      value={clausula}
      onChange={(e) => setClausula(e.target.value)}
      rows={8}
      />

      <button type="button" onClick={'função para o submit'}>Enviar</button>

      <div className="resultado">

        <p>{resposta || "Nenhuma resposta ainda."}</p>
      </div>
    </div>
  );
}
export default App;