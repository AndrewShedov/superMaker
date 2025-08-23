function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year, month) {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalizeDatePart(part, fallbackMin, fallbackMax) {
  if (part == null) return randomInt(fallbackMin, fallbackMax);
  return part;
}

function validateDateParts(year, month, day, hour) {
  if (month < 1 || month > 12) throw new Error(`Invalid month: ${month}`);
  const maxDays = daysInMonth(year, month);
  if (day < 1 || day > maxDays) throw new Error(`Invalid day: ${day} for month ${month} in year ${year}`);
  if (hour < 0 || hour > 23) throw new Error(`Invalid hour: ${hour}`);
}

export function randomDate({ min, max } = {}) {
  const nowYear = new Date().getFullYear();

  // if there is no min/max - random date
  if (!min && !max) {
    const year = randomInt(1970, nowYear);
    const month = randomInt(1, 12);
    const day = randomInt(1, daysInMonth(year, month));
    const hour = randomInt(0, 23);
    const minute = randomInt(0, 59);
    const second = randomInt(0, 59);
    const ms = randomInt(0, 999);

    return new Date(year, month - 1, day, hour, minute, second, ms);
  }

  // if there is only max → generate min
  if (max && !min) {
    const minYear = randomInt(1970, max.year ?? nowYear);
    min = {
      year: minYear,
      month: randomInt(1, 12),
      day: randomInt(1, daysInMonth(minYear, randomInt(1, 12))),
      hour: randomInt(0, 23),
    };
  }

  // if there is only min → generate max
  if (min && !max) {
    const maxYear = randomInt(min.year ?? 1970, nowYear);
    max = {
      year: maxYear,
      month: randomInt(1, 12),
      day: randomInt(1, daysInMonth(maxYear, randomInt(1, 12))),
      hour: randomInt(0, 23),
    };
  }

  // normalization of values
  const minYear = normalizeDatePart(min.year, 1970, nowYear);
  const maxYear = normalizeDatePart(max.year, minYear, nowYear);

  if (minYear > maxYear) throw new Error("min.year cannot be greater than max.year");

  const year = randomInt(minYear, maxYear);

  const minMonth = min.month ?? 1;
  const maxMonth = max.month ?? 12;
  const month = randomInt(minMonth, maxMonth);

  const minDay = min.day ?? 1;
  const maxDay = max.day ?? daysInMonth(year, month);
  const day = randomInt(minDay, maxDay);

  const minHour = min.hour ?? 0;
  const maxHour = max.hour ?? 23;
  const hour = randomInt(minHour, maxHour);

  validateDateParts(year, month, day, hour);

  const minute = randomInt(0, 59);
  const second = randomInt(0, 59);
  const ms = randomInt(0, 999);

  return new Date(year, month - 1, day, hour, minute, second, ms);
}
