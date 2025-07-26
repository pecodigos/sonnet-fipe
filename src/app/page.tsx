'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface Marca {
  codigo: string;
  nome: string;
}

interface Modelo {
  codigo: string;
  nome: string;
}

interface Ano {
  codigo: string;
  nome: string;
}

interface Detalhes {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
}

export default function App() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [anos, setAnos] = useState<Ano[]>([]);
  const [detalhes, setDetalhes] = useState<Detalhes | null>(null);

  const [selectedMarca, setSelectedMarca] = useState<string>('');
  const [selectedModelo, setSelectedModelo] = useState<string>('');
  const [selectedAno, setSelectedAno] = useState<string>('');

  // Search states
  const [marcaSearch, setMarcaSearch] = useState<string>('');
  const [modeloSearch, setModeloSearch] = useState<string>('');
  const [anoSearch, setAnoSearch] = useState<string>('');

  // Filtered arrays
  const [filteredMarcas, setFilteredMarcas] = useState<Marca[]>([]);
  const [filteredModelos, setFilteredModelos] = useState<Modelo[]>([]);
  const [filteredAnos, setFilteredAnos] = useState<Ano[]>([]);

  // Show dropdown states
  const [showMarcaDropdown, setShowMarcaDropdown] = useState<boolean>(false);
  const [showModeloDropdown, setShowModeloDropdown] = useState<boolean>(false);
  const [showAnoDropdown, setShowAnoDropdown] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/fipe?path=carros/marcas')
      .then((res) => res.json())
      .then((data: Marca[]) => {
        setMarcas(data);
        setFilteredMarcas(data);
      });
  }, []);

  // Filter marcas based on search
  useEffect(() => {
    const filtered = marcas.filter((marca) =>
      marca.nome.toLowerCase().includes(marcaSearch.toLowerCase())
    );
    setFilteredMarcas(filtered);
  }, [marcas, marcaSearch]);

  // Filter modelos based on search
  useEffect(() => {
    const filtered = modelos.filter((modelo) =>
      modelo.nome.toLowerCase().includes(modeloSearch.toLowerCase())
    );
    setFilteredModelos(filtered);
  }, [modelos, modeloSearch]);

  // Filter anos based on search
  useEffect(() => {
    const filtered = anos.filter((ano) =>
      ano.nome.toLowerCase().includes(anoSearch.toLowerCase())
    );
    setFilteredAnos(filtered);
  }, [anos, anoSearch]);

  useEffect(() => {
    if (!selectedMarca) return;

    fetch(`/api/fipe?path=carros/marcas/${selectedMarca}/modelos`)
      .then((res) => res.json())
      .then((data) => {
        setModelos(data.modelos);
        setFilteredModelos(data.modelos);
      });
  }, [selectedMarca]);

  useEffect(() => {
    if (!selectedMarca || !selectedModelo) return;

    fetch(`/api/fipe?path=carros/marcas/${selectedMarca}/modelos/${selectedModelo}/anos`)
      .then((res) => res.json())
      .then((data: Ano[]) => {
        setAnos(data);
        setFilteredAnos(data);
      });
  }, [selectedMarca, selectedModelo]);

  useEffect(() => {
    if (!selectedMarca || !selectedModelo || !selectedAno) return;

    fetch(`/api/fipe?path=carros/marcas/${selectedMarca}/modelos/${selectedModelo}/anos/${selectedAno}`)
      .then((res) => res.json())
      .then((data: Detalhes) => setDetalhes(data));
  }, [selectedMarca, selectedModelo, selectedAno]);

  const handleMarcaSelect = (marca: Marca) => {
    setSelectedMarca(marca.codigo);
    setMarcaSearch(marca.nome);
    setShowMarcaDropdown(false);
    // Reset dependent fields
    setSelectedModelo('');
    setSelectedAno('');
    setModeloSearch('');
    setAnoSearch('');
    setDetalhes(null);
  };

  const handleModeloSelect = (modelo: Modelo) => {
    setSelectedModelo(modelo.codigo);
    setModeloSearch(modelo.nome);
    setShowModeloDropdown(false);
    // Reset dependent fields
    setSelectedAno('');
    setAnoSearch('');
    setDetalhes(null);
  };

  const handleAnoSelect = (ano: Ano) => {
    setSelectedAno(ano.codigo);
    setAnoSearch(ano.nome);
    setShowAnoDropdown(false);
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>🚗 Consulta Tabela FIPE</h1>
        <p className={styles.subtitle}>Encontre o valor do seu veículo de forma rápida e fácil</p>
        
        <div className={styles.formContainer}>
          {/* Marca Selector */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Marca do Veículo</label>
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Digite ou selecione a marca..."
                value={marcaSearch}
                onChange={(e) => setMarcaSearch(e.target.value)}
                onFocus={() => setShowMarcaDropdown(true)}
                onBlur={() => setTimeout(() => setShowMarcaDropdown(false), 200)}
              />
              {showMarcaDropdown && filteredMarcas.length > 0 && (
                <div className={styles.dropdown}>
                  {filteredMarcas.map((marca) => (
                    <div
                      key={marca.codigo}
                      className={styles.dropdownItem}
                      onClick={() => handleMarcaSelect(marca)}
                    >
                      {marca.nome}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modelo Selector */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Modelo do Veículo</label>
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={`${styles.searchInput} ${!selectedMarca ? styles.disabled : ''}`}
                placeholder={selectedMarca ? "Digite ou selecione o modelo..." : "Selecione uma marca"}
                value={modeloSearch}
                onChange={(e) => setModeloSearch(e.target.value)}
                onFocus={() => selectedMarca && setShowModeloDropdown(true)}
                onBlur={() => setTimeout(() => setShowModeloDropdown(false), 200)}
                disabled={!selectedMarca}
              />
              {showModeloDropdown && filteredModelos.length > 0 && (
                <div className={styles.dropdown}>
                  {filteredModelos.map((modelo) => (
                    <div
                      key={modelo.codigo}
                      className={styles.dropdownItem}
                      onClick={() => handleModeloSelect(modelo)}
                    >
                      {modelo.nome}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ano Selector */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Ano do Veículo</label>
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={`${styles.searchInput} ${!selectedModelo ? styles.disabled : ''}`}
                placeholder={selectedModelo ? "Digite ou selecione o ano..." : "Selecione um modelo"}
                value={anoSearch}
                onChange={(e) => setAnoSearch(e.target.value)}
                onFocus={() => selectedModelo && setShowAnoDropdown(true)}
                onBlur={() => setTimeout(() => setShowAnoDropdown(false), 200)}
                disabled={!selectedModelo}
              />
              {showAnoDropdown && filteredAnos.length > 0 && (
                <div className={styles.dropdown}>
                  {filteredAnos.map((ano) => (
                    <div
                      key={ano.codigo}
                      className={styles.dropdownItem}
                      onClick={() => handleAnoSelect(ano)}
                    >
                      {ano.nome}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {detalhes && (
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>
              {detalhes.Modelo} ({detalhes.AnoModelo})
            </h2>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Marca:</span>
                <span className={styles.resultValue}>{detalhes.Marca}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Combustível:</span>
                <span className={styles.resultValue}>{detalhes.Combustivel}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Código FIPE:</span>
                <span className={styles.resultValue}>{detalhes.CodigoFipe}</span>
              </div>
              <div className={`${styles.resultItem} ${styles.valueHighlight}`}>
                <span className={styles.resultLabel}>Valor:</span>
                <span className={styles.resultValuePrice}>{detalhes.Valor}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
