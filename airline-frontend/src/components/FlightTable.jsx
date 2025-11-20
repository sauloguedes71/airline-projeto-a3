export default function FlightTable({ flights }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (flights.length === 0) {
    return (
      <div className="text-center p-8 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground">Nenhum voo encontrado. Tente buscar por "FRA", "GRU" ou "GOL".</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
      <table className="min-w-full">
        <thead className="bg-muted text-foreground uppercase text-xs">
          <tr>
            <th className="py-3 px-4 text-left font-semibold">Origem</th>
            <th className="py-3 px-4 text-left font-semibold">Destino</th>
            <th className="py-3 px-4 text-left font-semibold">Companhia</th>
            <th className="py-3 px-4 text-left font-semibold">Preço</th>
            <th className="py-3 px-4 text-left font-semibold">Duração</th>
          </tr>
        </thead>
        <tbody className="bg-card text-foreground">
          {flights.map((flight) => (
            <tr key={flight.id} className="border-b border-border hover:bg-accent/50 transition-colors">
              <td className="py-3 px-4">{flight.origem}</td>
              <td className="py-3 px-4">{flight.destino}</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {flight.companhia}
                </span>
              </td>
              <td className="py-3 px-4 font-bold text-secondary">{formatPrice(flight.preco)}</td>
              <td className="py-3 px-4">{flight.duracao_min} min</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}