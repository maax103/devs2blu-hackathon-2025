import React, {useState} from "react";
import "./App.css";


function App(){
  const [clausula, setClausula] = useState("");
  const [resposta, setResposta] = useState("");
  


  const handleSubmit = async () => {
    const url = `http://${import.meta.env.VITE_SERVER_HOST}:${import.meta.env.VITE_SERVER_PORT}/ai`
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clausula: clausula }),
      });

      if (!response.ok) {
        throw new Error("Erro ao se comunicar com o servidor.");
      }

      const data = await response.json();

      
      setResposta(data.resultado || "Resposta recebida, mas vazia.");
    } catch (error) {
      console.error("Erro:", error);
      setResposta("Ocorreu um erro ao enviar a cláusula.");
    }
  };




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

      <button type="button" onClick={handleSubmit}>Enviar</button>

      <div className="resultado">

        <p>{resposta || "Nenhuma resposta ainda."}</p>
      </div>
    </div>
  );
}
export default App;