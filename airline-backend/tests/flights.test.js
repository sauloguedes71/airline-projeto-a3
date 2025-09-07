import request from "supertest";
import app from "../server.js";

describe("API de Voos", () => {
  //  Testa rota health
  it("GET /health deve retornar status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });

  //  Testa listagem de voos
  it("GET /flights deve retornar uma lista paginada", async () => {
    const res = await request(app).get("/flights?page=1&pageSize=5");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  //  Testa pegar um voo por ID
  it("GET /flights/:id deve retornar um voo específico", async () => {
    const res = await request(app).get("/flights/1");
    if (res.statusCode === 404) {
      expect(res.body).toHaveProperty("error");
    } else {
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id");
    }
  });

  //  Testa estatísticas de voos
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

  //  Testa a rota de busca
  describe("API de Busca", () => {
    // Busca linear
    it("GET /flights/search?algorithm=linear deve encontrar um voo", async () => {
      const res = await request(app).get(
        "/flights/search?key=preco&value=200.27&algorithm=linear"
      );
      expect(res.statusCode).toBe(200);
      expect(res.body.result).toHaveProperty("preco", "200.27");
      expect(res.body.algorithm).toBe("linear");
    });

    // Busca binária
    it("GET /flights/search?algorithm=binary deve encontrar um voo", async () => {
      const res = await request(app).get(
        "/flights/search?key=preco&value=200.27&algorithm=binary"
      );
      expect(res.statusCode).toBe(200);
      expect(res.body.result).toHaveProperty("preco", "200.27");
      expect(res.body.algorithm).toBe("binary");
    });
  });

  //  Testes de ordenação
  describe("Testes de Ordenação", () => {
    // Ordenação descendente com Quicksort
    it("GET /flights?algorithm=quicksort deve ordenar por duracao_min DESC", async () => {
      const res = await request(app).get(
        "/flights?sortBy=duracao_min&order=desc&algorithm=quicksort"
      );
      expect(res.statusCode).toBe(200);
      const duracoes = res.body.data.map((f) => Number(f.duracao_min));
      for (let i = 0; i < duracoes.length - 1; i++) {
        expect(duracoes[i]).toBeGreaterThanOrEqual(duracoes[i + 1]);
      }
    });
  });

  //  Testes para as estatísticas de preço por companhia
  describe("Testes de Estatísticas Adicionais", () => {
    it("GET /flights/stats/cheapest-company deve retornar a companhia com o menor preco", async () => {
      const res = await request(app).get("/flights/stats/cheapest-company");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("companhia");
      expect(res.body).toHaveProperty("menor_preco");
    });

    it("GET /flights/stats/most-expensive-company deve retornar a companhia com o maior preco", async () => {
      const res = await request(app).get(
        "/flights/stats/most-expensive-company"
      );
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("companhia");
      expect(res.body).toHaveProperty("maior_preco");
    });
  });

});
afterAll(async () => {
  const { pool } = await import("../src/db.js");
  await pool.end();
});
