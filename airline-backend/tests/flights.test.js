import request from "supertest";
import app from "../server.js"; // importa sua API

describe("API de Voos", () => {
  // 🔹 Testa rota health
  it("GET /health deve retornar status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });

  // 🔹 Testa listagem de voos
  it("GET /flights deve retornar uma lista paginada", async () => {
    const res = await request(app).get("/flights?page=1&pageSize=5");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // 🔹 Testa pegar um voo por ID
  it("GET /flights/:id deve retornar um voo específico", async () => {
    const res = await request(app).get("/flights/1"); // usa ID existente no banco
    if (res.statusCode === 404) {
      expect(res.body).toHaveProperty("error");
    } else {
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id");
    }
  });

  // 🔹 Testa estatísticas de voos
  it("GET /flights/stats/all deve retornar estatísticas completas", async () => {
    const res = await request(app).get("/flights/stats/all");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("medias");
    expect(res.body).toHaveProperty("min");
    expect(res.body).toHaveProperty("max");

    if (res.body.total > 0) {
      expect(res.body.min).toHaveProperty("preco");
      expect(res.body.max).toHaveProperty("preco");
      expect(res.body.min).toHaveProperty("dataIda");
      expect(res.body.max).toHaveProperty("dataIda");
    }
  });
});
afterAll(async () => {
  const { pool } = await import("../src/db.js");
  await pool.end();
});
