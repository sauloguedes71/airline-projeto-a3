import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000", // backend
});

// Buscar voos
export const getFlights = (params) => API.get("/flights", { params });

// Buscar voo por ID
export const getFlightById = (id) => API.get(`/flights/${id}`);

// Estatísticas
export const getStats = (params) => API.get("/flights/stats", { params });

// Busca com algoritmos
export const searchFlights = (params) => API.get("/flights/search", { params });

export default API;
