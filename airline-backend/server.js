import express from "express";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import flightsRoutes from "./src/routes/flights.js";
import { errorHandler } from "./src/errorHandler.js";
import { pool } from "./src/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(compression());
app.use(morgan("dev"));

const PORT = Number(process.env.PORT || 4000);

// Middleware tempo de execução
app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1e6;
    console.log(`[${req.method}] ${req.originalUrl} - ${ms.toFixed(3)} ms`);
  });

  next();
});

// Health check (checa conexão com banco)
app.get("/health", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM flights");
    res.json({ status: "ok", records: Number(result.rows[0].count) });
  } catch (e) {
    next(e);
  }
});

// Rotas de voos (CRUD + filtros + estatísticas)
app.use("/flights", flightsRoutes);

// Middleware global de erros
app.use(errorHandler);

// Só inicia servidor se não for teste
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 API em http://localhost:${PORT}`);
  });
}

export { app };
export default app;
