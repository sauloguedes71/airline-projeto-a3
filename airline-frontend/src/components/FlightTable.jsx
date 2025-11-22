export default function FlightTable({ flights }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  if (!flights || flights.length === 0) {
    return (
      <div className="glass-card p-12 text-center rounded-xl animate-fade">
        <p className="text-xl text-muted-foreground font-semibold">
          Nenhum voo encontrado.
        </p>
        <p className="text-sm opacity-60 mt-2">
          Ajuste os filtros e tente novamente.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-table rounded-2xl overflow-hidden animate-card">
      <table className="min-w-full divide-y divide-border">
        
        <thead className="bg-primary/20 backdrop-blur-md">
          <tr>
            <th className="th">Origem</th>
            <th className="th">Destino</th>
            <th className="th">Companhia</th>
            <th className="th">Preço Econômica</th>
            <th className="th">Executiva</th>
            <th className="th">Premium</th>
            <th className="th">Duração</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {flights.map((f, index) => (
            <tr
              key={index}
              className="hover:bg-white/10 transition-all cursor-pointer"
            >
              <td className="td">{f.origem}</td>
              <td className="td">{f.destino}</td>
              <td className="td">
                <span className="tag">{f.companhia}</span>
              </td>

              <td className="td text-green-500 font-bold">
                {formatPrice(f.precos.economica)}
              </td>
              <td className="td text-blue-500 font-bold">
                {formatPrice(f.precos.executiva)}
              </td>
              <td className="td text-purple-500 font-bold">
                {formatPrice(f.precos.premium)}
              </td>

              <td className="td">{f.duracao_horas} h</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
