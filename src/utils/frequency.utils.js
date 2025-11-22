
function buildFullRangeFrequencies(docs, fields = []) {
  // initialize 0000..9999 with zeros
  const counts = {};

  for (let i = 0; i <= 9999; i++) {
    const key = String(i).padStart(4, "0");
    counts[key] = 0;
  }

  if (!Array.isArray(docs) || docs.length === 0 || !Array.isArray(fields) || fields.length === 0) {
    return counts;
  }

  // iterate docs and increment
  for (const doc of docs) {
    for (const field of fields) {
      const arr = doc[field];

      if (!Array.isArray(arr)) continue;
      if (!arr.length) continue;

      for (const raw of arr) {
        const s = String(raw).trim();
        // accept only 1-4 digits (no letters). e.g., "1","001","0999"
        if (!/^\d{1,4}$/.test(s)) continue;

        const key = s.padStart(4, "0");
        counts[key] += 1;
      }
    }
  }

  return counts;
}

module.exports = { buildFullRangeFrequencies };
