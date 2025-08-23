export function randomBoolean(chance = 0.5) {
  if (typeof chance !== "number" || chance < 0 || chance > 1) {
    throw new Error("chance must be a number between 0 and 1");
  }
  return Math.random() < chance;
}
