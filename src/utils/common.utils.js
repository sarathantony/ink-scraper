const extractNumbers = (text, newPattern, oldPattern) => {
  try {
    let match = text.match(newPattern);

    // If no match for newPattern, then try with oldPattern.
    if (oldPattern && !match) match = text.match(oldPattern);

    // If still no match, return an empty array.
    if (!match) return [];

    return match[1].match(/\b\d{3,4}\b/g) || [];
  } catch (err) {
    console.error(`Error extracting numbers with regex`, err.message);

    return [];
  }
};

function parseDMY(str) {
  const [d, m, y] = str.split('/');

  return new Date(`${y}-${m}-${d}T00:00:00`);
}

function buildPrizedList() {
  const obj = {};

  for (let i = 0; i <= 9999; i++) {
    const key = String(i).padStart(4, "0");
    obj[key] = 0;
  }

  return obj;
}

module.exports = { extractNumbers, parseDMY, buildPrizedList };
