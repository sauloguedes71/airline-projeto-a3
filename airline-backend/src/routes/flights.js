import express from "express";
import {
  searchFlights,
  getFlights,
  getFlightById,
  getFlightStats,
} from "../controllers/flightsController.js";

const router = express.Router();

router.get("/search", searchFlights); // Rota para a busca
router.get("/", getFlights); // todos os voos
router.get("/:id", getFlightById); // voo específico
router.get("/stats/all", getFlightStats); // estatísticas

export default router;
