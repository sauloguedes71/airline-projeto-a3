import { useState } from "react";
import FlightSearch from "./components/FlightSearch";
import FlightTable from "./components/FlightTable";
import { getFlights } from "./api";

export default function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (params) => {
    setLoading(true);
    try {
      const res = await getFlights({ ...params, page: 1, pageSize: 20 });
      setFlights(res.data.data);
      console.log("Tempo de ordenação:", res.data.sortDuration, "ms");
    } catch (err) {
      console.error("Erro ao buscar voos:", err);
    }
    setLoading(false);
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          ✈️ Sistema de Busca de Voos
        </h1>
        {/* Formulário de busca */}
        <FlightSearch onSearch={handleSearch} />
        {/* Resultados */}
        {loading ? (
          <p className="text-center mt-6 text-gray-500">Carregando...</p>
        ) : (
          <FlightTable flights={flights} />
        )}
      </div>
    </div>
  );
}
