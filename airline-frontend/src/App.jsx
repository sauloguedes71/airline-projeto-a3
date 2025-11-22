import { useState } from "react";
import FlightSearch from "./components/FlightSearch";
import FlightTable from "./components/FlightTable";
import ToggleTheme from "./components/ToggleTheme";
import { getFlights } from "./api";

// Ícone SVG
const PlaneIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 17.8 20 20l-2.2-2.2zM2 13h15.5l-5.3-5.3a2.5 2.5 0 0 1-3.5 0zM15.5 13H17l-3-3H7L4 7z" />
  </svg>
);

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
    <div className="min-h-screen glass-animated p-6 flex flex-col items-center backdrop-blur-sm animate-card">
      <div className="max-w-6xl mx-auto">
         <div className="absolute right-0 -top-4">
    <ToggleTheme />
  </div>
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PlaneIcon className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Sistema de Busca de Voos</h1>
          </div>
          <p className="text-muted-foreground text-lg">Encontre os melhores voos para o seu destino</p>
        </div>

        {/* Componente de Busca */}
        <div className="glass-dark p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <PlaneIcon className="h-6 w-6" />
            Buscar Voos
          </h2>
          <FlightSearch onSearch={handleSearch} />
        </div>

        {/* Resultados da Busca */}
        <div className="mt-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : (
            <FlightTable flights={flights} />
          )}
        </div>
      </div>
    </div>
  );
}