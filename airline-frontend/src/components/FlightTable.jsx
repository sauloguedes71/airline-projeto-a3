export default function FlightTable({ flights }) {
  if (!flights.length) return <p className="p-4">Nenhum voo encontrado.</p>;

  return (
   <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden shadow">
  <thead className="bg-blue-600 text-white">
    <tr>
      <th className="px-4 py-3">ID</th>
      <th className="px-4 py-3">Origem</th>
      <th className="px-4 py-3">Destino</th>
      <th className="px-4 py-3">Companhia</th>
      <th className="px-4 py-3">Preço</th>
      <th className="px-4 py-3">Duração</th>
      <th className="px-4 py-3">Data Ida</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {flights.map((f) => (
      <tr key={f.id} className="hover:bg-gray-50 transition">
        <td className="px-4 py-2">{f.id}</td>
        <td className="px-4 py-2">{f.origem}</td>
        <td className="px-4 py-2">{f.destino}</td>
        <td className="px-4 py-2">{f.companhia}</td>
        <td className="px-4 py-2 font-semibold text-blue-600">
          R$ {f.preco}
        </td>
        <td className="px-4 py-2">{f.duracao_min} min</td>
        <td className="px-4 py-2">{new Date(f.data_ida).toLocaleDateString()}</td>
      </tr>
    ))}
  </tbody>
</table>
  );
}
