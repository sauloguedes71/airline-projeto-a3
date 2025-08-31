// Função para medir o tempo de execução de uma função
export function measureTime(func) {
  const start = process.hrtime.bigint();
  const result = func();
  const end = process.hrtime.bigint();
  const durationInNs = end - start;
  const durationInMs = Number(durationInNs) / 1e6;
  return { result, durationInMs };
}

// Implementação do algoritmo Bubble Sort 
export function bubbleSort(arr, key, order) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      let shouldSwap = false;
      const val1 = Number(arr[j][key]);
      const val2 = Number(arr[j + 1][key]);

      if (order === "asc") {
        shouldSwap = val1 > val2;
      } else {
        shouldSwap = val1 < val2;
      }

      if (shouldSwap) {
        // Troca os elementos
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// A função de particionamento do Quicksort 
function partition(arr, start, end, key, order) {
  const pivotValue = Number(arr[end][key]);
  let pivotIndex = start;

  for (let i = start; i < end; i++) {
    const shouldSwap =
      order === "asc"
        ? Number(arr[i][key]) < pivotValue
        : Number(arr[i][key]) > pivotValue;

    if (shouldSwap) {
      [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
      pivotIndex++;
    }
  }

  [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
  return pivotIndex;
}

// O algoritmo Quicksort
export function quickSort(arr, key, order, start = 0, end = arr.length - 1) {
  if (start >= end) {
    return arr;
  }

  const index = partition(arr, start, end, key, order);
  quickSort(arr, key, order, start, index - 1);
  quickSort(arr, key, order, index + 1, end);
  return arr;
}

// A função de busca linear
export function linearSearch(arr, key, value) {
  for (let i = 0; i < arr.length; i++) {
    if (String(arr[i][key]) === String(value)) {
      return arr[i]; // Retorna o objeto encontrado
    }
  }
  return null; // Retorna null se não encontrar
}

// A função de busca binária
export function binarySearch(arr, key, value) {
  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    const midValue = Number(arr[mid][key]);
    const searchValue = Number(value);

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
