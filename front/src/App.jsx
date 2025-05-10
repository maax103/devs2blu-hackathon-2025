import React, { useState } from "react";
import "./App.css";

function App() {
  const [clausula, setClausula] = useState("");
  const [resposta, setResposta] = useState(null);

  const handleSubmit = async () => {
    const url = `http://${import.meta.env.VITE_SERVER_HOST}:${import.meta.env.VITE_SERVER_PORT}/ai`;
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

  // Componente para exibir o nível de risco com cores correspondentes
  const RiskBadge = ({ level }) => {
    const getColor = () => {
      switch (level) {
        case "Alto":
          return "risk-high";
        case "Médio":
          return "risk-medium";
        case "Baixo":
          return "risk-low";
        default:
          return "";
      }
    };

    return (
      <span className={`risk-badge ${getColor()}`}>
        {level}
      </span>
    );
  };

  // Componente para exibir uma categoria
  const CategoryTag = ({ category }) => {
    return (
      <span className="category-tag">
        {category}
      </span>
    );
  };

  // Componente para renderizar a análise do contrato
  const AnalysisResult = ({ data }) => {
    return (
      <div className="analysis-content">
        {data.map((clause, index) => (
          <div key={index} className="clause-analysis">
            <div className="clause-header">
              <div className="clause-id-container">
                <span className="clause-number">{clause.number}</span>
                <span className="clause-id">{clause.clauseId}</span>
              </div>
              <h2 className="clause-title">{clause.title}</h2>
              <div className="risk-container">
                <span className="risk-label">Nível de Risco:</span>
                <RiskBadge level={clause.riskLevel} />
              </div>
            </div>
            
            <div className="clause-text">
              <p>{clause.text}</p>
            </div>
            
            <div className="categories-section">
              <h3>Categorias</h3>
              <div className="categories-container">
                {clause.categories.map((category, catIndex) => (
                  <CategoryTag key={catIndex} category={category} />
                ))}
              </div>
            </div>
            
            <div className="issues-section">
              <h3>Problemas Identificados</h3>
              <ul className="issues-list">
                {clause.issues.map((issue, issueIndex) => (
                  <li key={issueIndex}>{issue}</li>
                ))}
              </ul>
            </div>
            
            <div className="recommendations-section">
              <h3>Recomendações</h3>
              <ul className="recommendations-list">
                {clause.recommendations.map((rec, recIndex) => (
                  <li key={recIndex}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
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
        {resposta ? (
          <AnalysisResult data={resposta} />
        ) : (
          <p className="empty-result">Nenhuma resposta ainda. Insira o texto do contrato e clique em Enviar para analisar.</p>
        )}
      </div>
    </div>
  );
}

export default App;