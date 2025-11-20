import { useState } from "react";

// Ícone SVG
const ArrowRightIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function FlightSearch({ onSearch }) {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [companhia, setCompanhia] = useState("");
  const [sortBy, setSortBy] = useState("preco");
  const [order, setOrder] = useState("asc");
  const [algorithm, setAlgorithm] = useState("bubble");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ origem, destino, companhia, sortBy, order, algorithm });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Inputs de Busca */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Origem</label>
          <input
            type="text"
            placeholder="Ex: FRA"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            className="w-full rounded-md border border-border bg-input p-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Destino</label>
          <input
            type="text"
            placeholder="Ex: JFK"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="w-full rounded-md border border-border bg-input p-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Companhia</label>
          <input
            type="text"
            placeholder="Ex: GOL"
            value={companhia}
            onChange={(e) => setCompanhia(e.target.value)}
            className="w-full rounded-md border border-border bg-input p-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Opções de Ordenação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-md border border-border bg-input p-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="preco">Preço</option>
            <option value="duracao_min">Duração</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Ordem</label>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-full rounded-md border border-border bg-input p-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Algoritmo</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full rounded-md border border-border bg-input p-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="bubble">Bubble Sort</option>
            <option value="quicksort">Quicksort</option>
          </select>
        </div>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Buscar Voos
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}