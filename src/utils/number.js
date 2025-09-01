export const int = ({ min = 0, max = Number.MAX_SAFE_INTEGER } = {}) => {
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('min and max must be numbers');
  }
  const validMin = Math.floor(Math.min(min, max));
  const validMax = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (validMax - validMin + 1)) + validMin;
};

export const randomNumber = ({ min, max, float = false, precision } = {}) => {
  if (min !== undefined && typeof min !== "number") {
    throw new Error("randomNumber({ min, max, float }) → min must be a number");
  }
  if (max !== undefined && typeof max !== "number") {
    throw new Error("randomNumber({ min, max, float }) → max must be a number");
  }

  // if only 'max' is passed
  if (min === undefined && max !== undefined) {
    const random = Math.random() * (max + 1);
    return float
      ? (precision ? +random.toFixed(precision) : random)
      : Math.floor(random);
  }

  // if only 'min' is passed
  if (min !== undefined && max === undefined) {
    const random = Math.random() * (Number.MAX_SAFE_INTEGER - min) + min;
    return float
      ? (precision ? +random.toFixed(precision) : random)
      : Math.floor(random);
  }

  // if both are there
  if (min !== undefined && max !== undefined) {
    if (min > max) [min, max] = [max, min]; // swap if you got it wrong
    const random = Math.random() * (max - min) + min;
    return float
      ? (precision ? +random.toFixed(precision) : random)
      : Math.floor(random);
  }

  // if nothing is passed → from 0 to MAX_SAFE_INTEGER
  const random = Math.random() * Number.MAX_SAFE_INTEGER;
  return float
    ? (precision ? +random.toFixed(precision) : random)
    : Math.floor(random);
};
