export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomSign() {
  return Math.round(Math.random()) * 2 - 1;
}
