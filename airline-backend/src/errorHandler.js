export function errorHandler(err, req, res, next) {
  console.error("Erro: ", err);
  res.status(500).json({ error: err.message || "Erro interno no servidor" });
}
