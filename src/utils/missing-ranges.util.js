/**
 * Detects missing ranges from a sorted list of integers.
 * Returns only ranges with >= 2 missing values.
 */
function findMissingRanges(sortedIds) {
  if (!sortedIds.length) return [];

  const min = sortedIds[0];
  const max = sortedIds[sortedIds.length - 1];

  const existingSet = new Set(sortedIds); // O(1) lookups
  const missingRanges = [];

  let start = null;

  for (let id = min; id <= max; id++) {
    const exists = existingSet.has(id);

    if (!exists) {
      if (start === null) start = id;
      continue;
    }

    // closing a missing range
    if (start !== null) {
      const end = id - 1;
      if (end > start) missingRanges.push(`${start}-${end}`);
      start = null;
    }
  }

  // Handle case where last numbers were missing
  if (start !== null && max > start) {
    missingRanges.push(`${start}-${max}`);
  }

  return missingRanges;
}

module.exports = { findMissingRanges };
