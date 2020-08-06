export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getComputedStyleDimentions(element) {
  let computedStyle = window.getComputedStyle(element);
  let elementSize = {
    width: parseInt(computedStyle.width, 10),
    height: parseInt(computedStyle.height, 10)
  };
  return elementSize;
}
