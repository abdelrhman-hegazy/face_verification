export function l2Normalize(vec) {
  const sum = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return vec.map(v => v / (sum || 1e-10));
}

export function cosineSimilarity(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-10);
}
