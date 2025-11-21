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

module.exports = { extractNumbers };
