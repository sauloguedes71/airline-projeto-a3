import { pool } from "../db.js";
import {
  measureTime,
  bubbleSort,
  quickSort,
  linearSearch,
  binarySearch,
} from "../utils/algorithms.js";

//  Função auxiliar para comparar valores (números e datas)
function normalizeValue(record, key) {
  if (!record[key]) return 0;
  if (key.includes("data")) {
    return new Date(record[key]).getTime(); // converte data -> número
  }
  return Number(record[key]) || record[key]; // se for número, converte
}

// ------------------ LISTAR VOOS ------------------
export async function getFlights(req, res, next) {
  try {
    const {
      origem,
      destino,
      companhia,
      sortBy,
      order,
      page = 1,
      pageSize = 50,
      algorithm = "bubble",
    } = req.query;

    let query = "SELECT * FROM flights WHERE 1=1";
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

    // Executa a consulta SQL para buscar TODOS os voos filtrados (sem paginação SQL)
    const result = await pool.query(query, params);
    let flights = result.rows;

    let sortDuration = 0;
    // Se houver um critério de ordenação, aplica o algoritmo e mede o tempo
    if (sortBy) {
      const valid = ["preco", "duracao_min", "data_ida"];
      if (valid.includes(sortBy.toLowerCase())) {
        let sortedResult;

        // Adicione a lógica de escolha do algoritmo
        if (algorithm === "quicksort") {
          sortedResult = measureTime(() =>
            quickSort(flights, sortBy, order, normalizeValue)
          );
          console.log(
            `Ordenação por ${sortBy} com Quicksort: ${sortedResult.durationInMs.toFixed(
              3
            )} ms`
          );
        } else {
          // default para bubble sort
          sortedResult = measureTime(() =>
            bubbleSort(flights, sortBy, order, normalizeValue)
          );
          console.log(
            `Ordenação por ${sortBy} com Bubble Sort: ${sortedResult.durationInMs.toFixed(
              3
            )} ms`
          );
        }

        flights = sortedResult.result;
        sortDuration = sortedResult.durationInMs;
      }
    }

    // 3Aplica a paginação na lista que já está ordenada
    const offset = (page - 1) * pageSize;
    const paginatedFlights = flights.slice(offset, offset + pageSize);

    // Envia a resposta com a lista paginada e o tempo de ordenação
    res.json({
      total: flights.length,
      data: paginatedFlights,
      sortDuration: sortDuration,
      algorithm: algorithm, // Para saber qual algoritmo foi usado
    });
  } catch (err) {
    next(err);
  }
}

// ------------------ VOOS POR ID ------------------
export async function getFlightById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM flights WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Voo não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// ------------------ ESTATÍSTICAS ------------------
export async function getFlightStats(req, res, next) {
  try {
    const { origem, destino } = req.query;

    let query = "SELECT preco, duracao_min, data_ida FROM flights WHERE 1=1";
    const params = [];

    if (origem) {
      params.push(origem);
      query += ` AND origem = $${params.length}`;
    }
    if (destino) {
      params.push(destino);
      query += ` AND destino = $${params.length}`;
    }

    const result = await pool.query(query, params);

    if (result.rowCount === 0) {
      return res.json({ total: 0, medias: null, min: null, max: null });
    }

    const precos = result.rows.map((r) => r.preco);
    const duracoes = result.rows.map((r) => r.duracao_min);
    const datasIda = result.rows.map((r) => r.data_ida);

    const total = result.rowCount;
    const somaPreco = precos.reduce((a, b) => a + b, 0);
    const somaDur = duracoes.reduce((a, b) => a + b, 0);

    const min = {
      preco: Math.min(...precos),
      dataIda: datasIda.length
        ? new Date(Math.min(...datasIda.map((d) => new Date(d)))).toISOString()
        : null,
    };

    const max = {
      preco: Math.max(...precos),
      dataIda: datasIda.length
        ? new Date(Math.max(...datasIda.map((d) => new Date(d)))).toISOString()
        : null,
    };

    res.json({
      total,
      medias: {
        preco: Number((somaPreco / total).toFixed(2)),
        duracaoMin: Math.round(somaDur / total),
      },
      min,
      max,
    });
  } catch (err) {
    next(err);
  }
}

// ------------------ BUSCA DE VOOS ------------------
export async function searchFlights(req, res, next) {
  try {
    const { key, value, algorithm = "linear" } = req.query;

    if (!key || !value) {
      return res
        .status(400)
        .json({ error: "Parâmetros 'key' e 'value' são obrigatórios." });
    }

    const result = await pool.query("SELECT * FROM flights");
    let flights = result.rows;
    let searchResult = null;
    let searchDuration = 0;

    // Variáveis para medir o tempo total, incluindo a ordenação
    let totalDuration = 0;

    if (algorithm === "binary") {
      //Ordena a lista de voos ANTES de fazer a busca binária.
      const sortedResult = measureTime(() =>
        quickSort(flights, key, "asc", normalizeValue)
      );
      flights = sortedResult.result;
      totalDuration += sortedResult.durationInMs;

      //Agora que está ordenada, execute a busca binária.
      const search = measureTime(() => binarySearch(flights, key, value));
      searchResult = search.result;
      searchDuration = search.durationInMs;
      totalDuration += searchDuration;

      console.log(
        `Busca Binária por '${key}' com valor '${value}': ${searchDuration.toFixed(
          3
        )} ms`
      );
      console.log(
        `Tempo total (ordenação + busca): ${totalDuration.toFixed(3)} ms`
      );
    } else {
      // default para busca linear
      const search = measureTime(() => linearSearch(flights, key, value));
      searchResult = search.result;
      searchDuration = search.durationInMs;
      totalDuration = searchDuration;
      console.log(
        `Busca Linear por '${key}' com valor '${value}': ${searchDuration.toFixed(
          3
        )} ms`
      );
    }

    if (searchResult) {
      res.json({
        result: searchResult,
        searchDuration: searchDuration,
        totalDuration: totalDuration,
        algorithm: algorithm,
      });
    } else {
      res.status(404).json({
        error: "Voo não encontrado",
        searchDuration: searchDuration,
        totalDuration: totalDuration,
        algorithm: algorithm,
      });
    }
  } catch (err) {
    next(err);
  }
}

// ------------------ COMPANHIA MAIS BARATA ------------------
export async function getCheapestCompany(req, res, next) {
  try {
    const query = `
      SELECT
        companhia,
        MIN(preco) AS menor_preco
      FROM
        flights
      GROUP BY
        companhia
      ORDER BY
        menor_preco ASC
      LIMIT 1;
    `;
    const result = await pool.query(query);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// ------------------ COMPANHIA MAIS CARA ------------------
export async function getMostExpensiveCompany(req, res, next) {
  try {
    const query = `
      SELECT
        companhia,
        MAX(preco) AS maior_preco
      FROM
        flights
      GROUP BY
        companhia
      ORDER BY
        maior_preco DESC
      LIMIT 1;
    `;
    const result = await pool.query(query);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}