import express from "express";
import {
  searchFlights,
  getFlights,
  getFlightById,
  getFlightStats,
  getCheapestCompany,
  getMostExpensiveCompany,
} from "../controllers/flightsController.js";

const router = express.Router();

router.get("/search", searchFlights); // Rota para a busca
router.get("/", getFlights); // todos os voos
router.get("/:id", getFlightById); // voo específico
router.get("/stats/all", getFlightStats); // estatísticas
router.get("/stats/cheapest-company", getCheapestCompany); // rota para companhia mais barata
router.get("/stats/most-expensive-company", getMostExpensiveCompany); // rota para companhia mais cara

export default router;
