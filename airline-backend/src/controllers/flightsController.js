import { pool } from "../db.js";
import {
  measureTime,
  bubbleSort,
  quickSort,
  linearSearch,
  binarySearch,
} from "../utils/algorithms.js";

function normalizeValue(record, key) {
  if (!record[key]) return 0;

  if (key.toLowerCase().includes("data")) {
    return new Date(record[key]).getTime();
  }

  return Number(record[key]) || record[key];
}

export async function getFlights(req, res, next) {
  try {
    const {
      origem,
      destino,
      companhia,
      temporada,
      sortBy,
      order,
      page = 1,
      pageSize = 50,
      algorithm = "bubble",
    } = req.query;

    let query = "SELECT * FROM voos WHERE 1=1";
    const params = [];

    if (origem) {
      params.push(origem);
      query += ` AND origem = $${params.length}`;
    }
    if (destino) {
      params.push(destino);
      query += ` AND destino = $${params.length}`;
    }
    if (companhia) {
      params.push(companhia);
      query += ` AND companhia = $${params.length}`;
    }
    if (temporada) {
      params.push(temporada);
      query += ` AND temporada = $${params.length}`;
    }

    const result = await pool.query(query, params);
    let flights = result.rows;

    let sortDuration = 0;
    if (sortBy) {
      const valid = [
        "preco_economica",
        "preco_executiva",
        "preco_premium",
        "duracao_horas",
        "data_partida",
        "antecedencia_dias",
        "lotacao_media",
      ];

      if (valid.includes(sortBy.toLowerCase())) {
        let sortedResult;

        if (algorithm === "quicksort") {
          sortedResult = measureTime(() =>
            quickSort(flights, sortBy, order, normalizeValue)
          );
        } else {
          sortedResult = measureTime(() =>
            bubbleSort(flights, sortBy, order, normalizeValue)
          );
        }

        flights = sortedResult.result;
        sortDuration = sortedResult.durationInMs;
      }
    }

    const offset = (page - 1) * pageSize;
    const paginatedFlights = flights.slice(offset, offset + pageSize);

    const formatted = paginatedFlights.map((f) => ({
      id: f.id_voo,
      data_partida: f.data_partida,
      origem: f.origem,
      destino: f.destino,
      duracao_horas: f.duracao_horas,
      precos: {
        economica: f.preco_economica,
        executiva: f.preco_executiva,
        premium: f.preco_premium,
      },
      temporada: f.temporada,
      antecedencia_dias: f.antecedencia_dias,
      lotacao_media: f.lotacao_media,
      companhia: f.companhia,
    }));

    res.json({
      total: flights.length,
      data: formatted,
      sortDuration,
      algorithm,
    });
  } catch (err) {
    next(err);
  }
}


export async function getFlightById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM voos WHERE id_voo = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Voo não encontrado" });
    }

    const f = result.rows[0];

    res.json({
      id: f.id_voo,
      data_partida: f.data_partida,
      origem: f.origem,
      destino: f.destino,
      duracao_horas: f.duracao_horas,
      precos: {
        economica: f.preco_economica,
        executiva: f.preco_executiva,
        premium: f.preco_premium,
      },
      temporada: f.temporada,
      antecedencia_dias: f.antecedencia_dias,
      lotacao_media: f.lotacao_media,
      companhia: f.companhia,
    });
  } catch (err) {
    next(err);
  }
}

export async function getFlightStats(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT preco_economica, preco_executiva, preco_premium, duracao_horas FROM voos"
    );

    if (result.rowCount === 0) {
      return res.json({ total: 0 });
    }

    const dados = result.rows;

    const precosTodos = dados.flatMap((d) => [
      d.preco_economica,
      d.preco_executiva,
      d.preco_premium,
    ]);

    const duracoes = dados.map((d) => d.duracao_horas);

    res.json({
      total: dados.length,
      mediaPreco: (
        precosTodos.reduce((a, b) => a + b, 0) / precosTodos.length
      ).toFixed(2),
      mediaDuracao: (
        duracoes.reduce((a, b) => a + b, 0) / duracoes.length
      ).toFixed(2),
      minPreco: Math.min(...precosTodos),
      maxPreco: Math.max(...precosTodos),
    });
  } catch (err) {
    next(err);
  }
}

export async function searchFlights(req, res, next) {
  try {
    const { key, value, algorithm = "linear" } = req.query;

    if (!key || !value) {
      return res.status(400).json({
        error: "Parâmetros key e value são obrigatórios.",
      });
    }

    const result = await pool.query("SELECT * FROM voos");
    let flights = result.rows;

    let searchResult = null;
    let duration = 0;

    if (algorithm === "binary") {
      const sorted = measureTime(() =>
        quickSort(flights, key, "asc", normalizeValue)
      );

      flights = sorted.result;
      duration += sorted.durationInMs;

      const found = measureTime(() =>
        binarySearch(flights, key, value)
      );

      searchResult = found.result;
      duration += found.durationInMs;
    } else {
      const found = measureTime(() =>
        linearSearch(flights, key, value)
      );

      searchResult = found.result;
      duration = found.durationInMs;
    }

    res.json({
      result: searchResult,
      duration,
      algorithm,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCheapestCompany(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT companhia,
             MIN(LEAST(preco_economica, preco_executiva, preco_premium)) AS menor
      FROM voos
      GROUP BY companhia
      ORDER BY menor ASC
      LIMIT 1
    `);

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function getMostExpensiveCompany(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT companhia,
             MAX(GREATEST(preco_economica, preco_executiva, preco_premium)) AS maior
      FROM voos
      GROUP BY companhia
      ORDER BY maior DESC
      LIMIT 1
    `);

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}
