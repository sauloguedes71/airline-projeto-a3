import { useState } from "react";

export default function FlightSearch({ onSearch }) {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [companhia, setCompanhia] = useState("");
  const [sortBy, setSortBy] = useState("preco");
  const [algorithm, setAlgorithm] = useState("quicksort");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ origem, destino, companhia, sortBy, algorithm });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg shadow mb-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Origem"
          value={origem}
          onChange={(e) => setOrigem(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Destino"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Companhia"
          value={companhia}
          onChange={(e) => setCompanhia(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="preco">Preço</option>
          <option value="duracao_min">Duração</option>
          <option value="data_ida">Data Ida</option>
        </select>

        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="bubble">Bubble Sort</option>
          <option value="quicksort">QuickSort</option>
        </select>
      </div>
      <button
        type="submit"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Buscar
      </button>
    </form>
  );
}
