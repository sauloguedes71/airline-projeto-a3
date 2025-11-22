import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function FlightSearch({ onSearch }) {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [companhia, setCompanhia] = useState("");
  const [temporada, setTemporada] = useState("");

  const [sortBy, setSortBy] = useState("preco_economica");
  const [order, setOrder] = useState("asc");
  const [algorithm, setAlgorithm] = useState("bubble");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ origem, destino, companhia, temporada, sortBy, order, algorithm });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 glass-card rounded-2xl animate-fade"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Origem</label>
          <input
            type="text"
            placeholder="Ex: GRU"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Destino</label>
          <input
            type="text"
            placeholder="Ex: JFK"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Companhia</label>
          <input
            type="text"
            placeholder="Ex: LATAM"
            value={companhia}
            onChange={(e) => setCompanhia(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Temporada</label>
          <select
            value={temporada}
            onChange={(e) => setTemporada(e.target.value)}
            className="input-field"
          >
            <option value="">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Baixa">Baixa</option>
          </select>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="preco_economica">Preço Econômica</option>
            <option value="preco_executiva">Preço Executiva</option>
            <option value="preco_premium">Preço Premium</option>
            <option value="duracao_horas">Duração (horas)</option>
            <option value="data_partida">Data</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Ordem</label>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="input-field"
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Algoritmo</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="input-field"
          >
            <option value="bubble">Bubble Sort</option>
            <option value="quicksort">QuickSort</option>
          </select>
        </div>

      </div>

      <div className="text-right">
        <button
          type="submit"
          className="btn-glass-primary flex items-center gap-2"
        >
          Buscar Voos
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
