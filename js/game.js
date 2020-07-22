import { Snake } from './snake.js';
import { Food } from './food.js';
import { getRandomInt, getRandomSign } from './util.js';

const gameRate = 1; // Render ticks per second
const gridUnit = 20; // Pixels per grid square
const snakeLength = 3;

const canvasWrapper = document.querySelector('.canvas-wrapper');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

resizeCanvas();

let lastRenderTime = 0;
let mainLoop = requestAnimationFrame(render);

function render(currentFrameTime) {
  mainLoop = requestAnimationFrame(render);

  const sinceLastRender = currentFrameTime - lastRenderTime;
  lastRenderTime = currentFrameTime;
  if (sinceLastRender < 1 / gameRate) return;
  // console.log('sinceLastRender', sinceLastRender);

  // resizeCanvas();
  draw();
}

function draw() {
  //
}

function resizeCanvas() {
  let wrapperStyle = window.getComputedStyle(canvasWrapper);
  let containerSize = {
    w: parseInt(wrapperStyle.width, 10),
    h: parseInt(wrapperStyle.height, 10)
  };
  console.log(containerSize, [canvas.width, canvas.height]);

  let adjustedSize = calculateGrid(containerSize);
  canvas.width = adjustedSize.w;
  canvas.height = adjustedSize.h;

  /* if (canvas.width != containerSize.w || canvas.height != containerSize.h) {
    canvas.width = containerSize.w;
    canvas.height = containerSize.h;
    console.log('resizeCanvas -> canvas.height', canvas.height);
    return true;
  } */
  return false;
}

function calculateGrid(containerSize) {
  let cellsX = Math.floor(containerSize.w / gridUnit);
  let cellsY = Math.floor(containerSize.h / gridUnit);
  console.log('cells', `${cellsX} : ${cellsY}`);

  let adjustedSize = { w: cellsX * gridUnit, h: cellsY * gridUnit };

  console.log('calculateGrid -> adjusted', adjustedSize);
  return adjustedSize;
}

function drawGrid() {
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#494949';
  for (let column = 1; column < cellsX; column++) {
    ctx.moveTo(column * gridUnit, 0);
    ctx.lineTo(column * gridUnit, canvas.height);
    ctx.stroke();
  }
  for (let row = 1; row < cellsY; row++) {
    ctx.moveTo(0, row * gridUnit);
    ctx.lineTo(canvas.width, row * gridUnit);
    ctx.stroke();
  }
}

document.addEventListener('keydown', handleKeypress);
function handleKeypress(event) {
  let pressedKey = event.key;
  console.log('handleKeypress -> pressedKey', pressedKey);

  if (pressedKey === 'Escape') cancelAnimationFrame(mainLoop);
}
