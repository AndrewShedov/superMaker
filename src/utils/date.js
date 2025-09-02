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

function validateDateParts(year, month, day, hour, minute, second, ms) {
  if (month < 1 || month > 12) throw new Error(`Invalid month: ${month}`);
  const maxDays = daysInMonth(year, month);
  if (day < 1 || day > maxDays) throw new Error(`Invalid day: ${day} for month ${month} in year ${year}`);
  if (hour < 0 || hour > 23) throw new Error(`Invalid hour: ${hour}`);
  if (minute < 0 || minute > 59) throw new Error(`Invalid minute: ${minute}`);
  if (second < 0 || second > 59) throw new Error(`Invalid second: ${second}`);
  if (ms < 0 || ms > 999) throw new Error(`Invalid millisecond: ${ms}`);
}

export function randomDate({ min = {}, max = {}, utc = false } = {}) {
  const nowYear = new Date().getFullYear();

  // Input validation
  if (min && (min.month < 1 || min.month > 12 || min.day < 1 || min.hour < 0 || min.hour > 23 ||
              min.minute < 0 || min.minute > 59 || min.second < 0 || min.second > 59 ||
              min.ms < 0 || min.ms > 999)) {
    throw new Error("Invalid min date parameters");
  }
  if (max && (max.month < 1 || max.month > 12 || max.day < 1 || max.hour < 0 || max.hour > 23 ||
              max.minute < 0 || max.minute > 59 || max.second < 0 || max.second > 59 ||
              max.ms < 0 || max.ms > 999)) {
    throw new Error("Invalid max date parameters");
  }

  // If there is no min/max - random date
  if (!min && !max) {
    const year = randomInt(1970, nowYear);
    const month = randomInt(1, 12);
    const day = randomInt(1, daysInMonth(year, month));
    const hour = randomInt(0, 23);
    const minute = randomInt(0, 59);
    const second = randomInt(0, 59);
    const ms = randomInt(0, 999);
    return utc
      ? new Date(Date.UTC(year, month - 1, day, hour, minute, second, ms))
      : new Date(year, month - 1, day, hour, minute, second, ms);
  }

  // If there is only max → generate min
  if (max && !min) {
    const minYear = randomInt(1970, max.year ?? nowYear);
    min = {
      year: minYear,
      month: randomInt(1, 12),
      day: randomInt(1, daysInMonth(minYear, randomInt(1, 12))),
      hour: randomInt(0, 23),
      minute: randomInt(0, 59),
      second: randomInt(0, 59),
      ms: randomInt(0, 999),
    };
  }

  // If there is only min → generate max
  if (min && !max) {
    const maxYear = randomInt(min.year ?? 1970, nowYear);
    max = {
      year: maxYear,
      month: randomInt(1, 12),
      day: randomInt(1, daysInMonth(maxYear, randomInt(1, 12))),
      hour: randomInt(0, 23),
      minute: randomInt(0, 59),
      second: randomInt(0, 59),
      ms: randomInt(0, 999),
    };
  }

  // Normalization of values
  const minYear = normalizeDatePart(min.year, 1970, nowYear);
  const maxYear = normalizeDatePart(max.year, minYear, nowYear);

  if (minYear > maxYear) throw new Error("min.year cannot be greater than max.year");

  const year = randomInt(minYear, maxYear);

  const minMonth = normalizeDatePart(min.month, 1, 12);
  const maxMonth = normalizeDatePart(max.month, minMonth, 12);
  const month = randomInt(minMonth, maxMonth);

  const minDay = normalizeDatePart(min.day, 1, daysInMonth(year, month));
  const maxDay = normalizeDatePart(max.day, minDay, daysInMonth(year, month));
  const day = randomInt(minDay, maxDay);

  const minHour = normalizeDatePart(min.hour, 0, 23);
  const maxHour = normalizeDatePart(max.hour, minHour, 23);
  const hour = randomInt(minHour, maxHour);

  const minMinute = normalizeDatePart(min.minute, 0, 59);
  const maxMinute = normalizeDatePart(max.minute, minMinute, 59);
  const minute = randomInt(minMinute, maxMinute);

  const minSecond = normalizeDatePart(min.second, 0, 59);
  const maxSecond = normalizeDatePart(max.second, minSecond, 59);
  const second = randomInt(minSecond, maxSecond);

  const minMs = normalizeDatePart(min.ms, 0, 999);
  const maxMs = normalizeDatePart(max.ms, minMs, 999);
  const ms = randomInt(minMs, maxMs);

  validateDateParts(year, month, day, hour, minute, second, ms);

  return utc
    ? new Date(Date.UTC(year, month - 1, day, hour, minute, second, ms))
    : new Date(year, month - 1, day, hour, minute, second, ms);
}