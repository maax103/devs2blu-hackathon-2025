import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resposta, setResposta] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    } else if (selectedFile) {
      setFile(null);
      setFileName("");
      setError("Por favor, selecione apenas arquivos PDF.");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Por favor, selecione um arquivo PDF para análise.");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const url = `http://${import.meta.env.VITE_SERVER_HOST}:${import.meta.env.VITE_SERVER_PORT}/ai/pdf`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResposta(data);
    } catch (error) {
      console.error("Erro:", error);
      setError(`Ocorreu um erro ao enviar o PDF: ${error.message}`);
      setResposta(null);
    } finally {
      setIsLoading(false);
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

      <div className="file-upload-container">
        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".pdf"
            id="pdf-file"
            className="file-input"
            onChange={handleFileChange}
          />
          <label htmlFor="pdf-file" className="file-label">
            {fileName ? fileName : "Selecionar arquivo PDF"}
          </label>
        </div>
        {fileName && (
          <div className="selected-file">
            <span className="file-name">{fileName}</span>
            <button 
              className="remove-file" 
              onClick={() => {
                setFile(null);
                setFileName("");
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        type="button" 
        onClick={handleSubmit} 
        disabled={isLoading || !file}
        className={isLoading ? "loading" : ""}
      >
        {isLoading ? "Analisando..." : "Analisar PDF"}
      </button>

      <div className="resultado">
        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Analisando documento PDF...</p>
          </div>
        ) : resposta ? (
          <AnalysisResult data={resposta} />
        ) : (
          <p className="empty-result">Nenhuma resposta ainda. Faça upload de um arquivo PDF e clique em Analisar PDF para começar.</p>
        )}
      </div>
    </div>
  );
}

export default App;
