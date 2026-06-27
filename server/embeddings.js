let db = null;

function setDb(database) {
  db = database;
}

const CACHE_MAX = 500;
const embeddingCache = new Map();

function generarPseudoEmbedding(texto) {
  const normalized = (texto || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  if (embeddingCache.has(normalized)) return embeddingCache.get(normalized);

  const words = normalized.split(/\s+/).filter(w => w.length > 1);
  const vector = new Array(128).fill(0);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 0; j < word.length && j < 128; j++) {
      vector[j] += word.charCodeAt(j) * (i + 1);
    }
  }

  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  const normalizedVec = norm > 0 ? vector.map(v => v / norm) : vector;

  if (embeddingCache.size >= CACHE_MAX) {
    const firstKey = embeddingCache.keys().next().value;
    embeddingCache.delete(firstKey);
  }
  embeddingCache.set(normalized, normalizedVec);

  return normalizedVec;
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return dot;
}

function levenshteinSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;

  const len1 = s1.length;
  const len2 = s2.length;
  const maxLen = Math.max(len1, len2);
  if (maxLen === 0) return 1;

  const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return 1 - matrix[len1][len2] / maxLen;
}

const ALIAS_MAP = {
  'starbucks': ['starbucks chile', 'starbucks mall', 'sbx chile', 'starbucks coffee', 'sbx'],
  'uber': ['uber trips', 'uber eat', 'uber eats'],
  'netflix': ['netflix.com', 'netflix chile'],
  'spotify': ['spotify premium', 'spotify p'],
  'copec': ['copec cl', 'copec ng'],
  'shell': ['shell chile'],
  'jumbo': ['jumbo chile', 'supermercado jumbo'],
  'lider': ['lider chile', 'supermercado lider'],
  'tottus': ['tottus chile'],
  'mcdonald': ['mcdonald\'s', 'mcdo', 'mcd'],
  'burger king': ['bk', 'burgerking'],
  ' pizza hut': ['pizza hut chile'],
  'kmr': ['kmr pizza', 'pizza kmr'],
};

function normalizarNombreComercio(nombre) {
  if (!nombre) return '';
  const lower = nombre.toLowerCase().trim();

  for (const [canonical, aliases] of Object.entries(ALIAS_MAP)) {
    if (aliases.includes(lower) || lower === canonical) {
      return canonical;
    }
  }

  return lower
    .replace(/\s*(chile|santiago|providencia|las condes|vitacura)\s*$/gi, '')
    .replace(/[\s\-]+/g, ' ')
    .trim();
}

async function encontrarComercioSimilar(comercioBuscado, userId) {
  if (!comercioBuscado || comercioBuscado.length < 3) return null;
  if (!db) return null;

  const normalized = normalizarNombreComercio(comercioBuscado);

  try {
    const rows = await db.all(
      'SELECT comercio, categoria FROM clasificacion_comercios WHERE user_id = $1',
      userId
    );

    let bestMatch = null;
    let bestScore = 0;

    for (const row of rows) {
      const rowNormalized = normalizarNombreComercio(row.comercio);

      const levScore = levenshteinSimilarity(normalized, rowNormalized);
      const embedA = generarPseudoEmbedding(normalized);
      const embedB = generarPseudoEmbedding(rowNormalized);
      const embedScore = cosineSimilarity(embedA, embedB);

      const combinedScore = Math.max(levScore, embedScore);

      if (combinedScore > bestScore && combinedScore > 0.75) {
        bestScore = combinedScore;
        bestMatch = { comercio: row.comercio, categoria: row.categoria, score: combinedScore };
      }
    }

    return bestMatch;
  } catch (e) {
    console.error('[Embeddings] Error buscando comercio similar:', e.message);
    return null;
  }
}

function similarityScore(comercioA, comercioB) {
  const normA = normalizarNombreComercio(comercioA);
  const normB = normalizarNombreComercio(comercioB);

  const levScore = levenshteinSimilarity(normA, normB);
  const embedA = generarPseudoEmbedding(normA);
  const embedB = generarPseudoEmbedding(normB);
  const embedScore = cosineSimilarity(embedA, embedB);

  return Math.max(levScore, embedScore);
}

export { setDb, generarPseudoEmbedding, cosineSimilarity, levenshteinSimilarity, normalizarNombreComercio, encontrarComercioSimilar, similarityScore, ALIAS_MAP };
export default { setDb, generarPseudoEmbedding, cosineSimilarity, levenshteinSimilarity, normalizarNombreComercio, encontrarComercioSimilar, similarityScore, ALIAS_MAP };