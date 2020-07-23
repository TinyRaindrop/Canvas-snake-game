export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomSign() {
  return Math.round(Math.random()) * 2 - 1;
}

export function getComputedStyleDimentions(element) {
  let computedStyle = window.getComputedStyle(element);
  let elementSize = {
    width: parseInt(computedStyle.width, 10),
    height: parseInt(computedStyle.height, 10)
  };
  return elementSize;
}
