// Função para medir o tempo de execução de uma função
export function measureTime(func) {
  const start = process.hrtime.bigint();
  const result = func();
  const end = process.hrtime.bigint();
  const durationInNs = end - start;
  const durationInMs = Number(durationInNs) / 1e6;
  return { result, durationInMs };
}

//  Função auxiliar para normalizar valores
function getValue(record, key) {
  if (!record || record[key] === undefined || record[key] === null) return 0;

  // Se o campo for data (ex: data_ida), converte para timestamp
  if (key.toLowerCase().includes("data")) {
    return new Date(record[key]).getTime();
  }

  // Se for número, garante conversão
  if (!isNaN(record[key])) {
    return Number(record[key]);
  }

  // Fallback: retorna como string para comparar
  return String(record[key]);
}

// ----------------- BUBBLE SORT (versão otimizada e segura) -----------------
export function bubbleSort(arr, key, order = "asc") {
  const sorted = [...arr];
  const n = sorted.length;
  let swapped;

  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      const val1 = getValue(sorted[j][key]);
      const val2 = getValue(sorted[j + 1][key]);

      let shouldSwap = false;
      if (order === "asc") {
        shouldSwap = val1 > val2;
      } else {
        shouldSwap = val1 < val2;
      }

      if (shouldSwap) {
        [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
      }
    }

    // 🔹 Se nenhuma troca ocorreu, o array já está ordenado → encerra antes
    if (!swapped) break;
  }
  return sorted;
}

// A função de particionamento do Quicksort
function partition(arr, start, end, key, order) {
  const pivotValue = getValue(arr[end], key);
  let pivotIndex = start;

  for (let i = start; i < end; i++) {
    const val = getValue(arr[i], key);

    const shouldSwap = order === "asc" ? val < pivotValue : val > pivotValue;

    if (shouldSwap) {
      [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
      pivotIndex++;
    }
  }

  [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
  return pivotIndex;
}

// ----------------- QUICK SORT (versão segura) -----------------
export function quickSort(arr, key, order = "asc") {
  if (!arr || arr.length <= 1) return arr;

  const array = [...arr]; // copia para não mutar
  const stack = [[0, array.length - 1]];

  while (stack.length > 0) {
    const [start, end] = stack.pop();
    if (start >= end) continue;

    const pivotIndex = partition(array, start, end, key, order);

    // Adiciona lados na pilha
    if (pivotIndex - 1 > start) {
      stack.push([start, pivotIndex - 1]);
    }
    if (pivotIndex + 1 < end) {
      stack.push([pivotIndex + 1, end]);
    }
  }

  return array;
}

// A função de busca linear
export function linearSearch(arr, key, value) {
  for (let i = 0; i < arr.length; i++) {
    if (String(getValue(arr[i], key)) === String(value)) {
      return arr[i]; // Retorna o objeto encontrado
    }
  }
  return null; // Retorna null se não encontrar
}

// A função de busca binária
export function binarySearch(arr, key, value) {
  let start = 0;
  let end = arr.length - 1;
  const searchValue = getValue({ [key]: value }, key);

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    const midValue = Number(arr[mid][key]);

    // Usa comparação numérica
    if (midValue === searchValue) {
      return arr[mid];
    }

    if (midValue < searchValue) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return null;
}
