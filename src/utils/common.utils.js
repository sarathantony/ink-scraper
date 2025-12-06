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

function getWeekdayFromDate(dateStr) {
  // Strict DD/MM/YYYY
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    throw new Error("Invalid date format. Expected DD/MM/YYYY");
  }

  const dd = Number(match[1]);
  const mm = Number(match[2]);
  const yyyy = Number(match[3]);

  // Validate month
  if (mm < 1 || mm > 12) {
    throw new Error("Invalid month in date");
  }

  // Validate day (handles leap years)
  const daysInMonth = new Date(yyyy, mm, 0).getDate();
  if (dd < 1 || dd > daysInMonth) {
    throw new Error("Invalid day for given month");
  }

  // Use UTC to avoid timezone shifting the date
  const date = new Date(Date.UTC(yyyy, mm - 1, dd));

  const weekdays = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];

  return weekdays[date.getUTCDay()];
}



module.exports = { extractNumbers, parseDMY, buildPrizedList, getWeekdayFromDate };
