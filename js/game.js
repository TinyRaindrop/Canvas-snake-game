import { Canvas } from './canvas.js';
import { Snake } from './snake.js';
import { Food } from './food.js';

const GRID_SCALE = 30; // Pixels per grid square
const GAME_SPEED = 120; // Milliseconds bettween re-renders
const SNAKE_LENGTH = 1; // Starting snake length, including head

const canvas = new Canvas('#canvas', GRID_SCALE);
const snake = new Snake(canvas, SNAKE_LENGTH);
// const food = new Food(canvas);

let lastRenderTime = 0;

// let mainLoop = requestAnimationFrame(render);

function render(currentFrameTime) {
  mainLoop = requestAnimationFrame(render);

  const sinceLastRender = currentFrameTime - lastRenderTime;
  if (sinceLastRender > GAME_SPEED) {
    console.log('sinceLastRender', sinceLastRender);

    update();
    draw();

    lastRenderTime = currentFrameTime;
  }
}

function update() {
  snake.move();
  // snake.checkCollision();
  // snake.devour();
}

function draw() {
  clearCanvas();
  // drawGrid();

  snake.draw(grid);
  // food.draw();
}

const keyControls = new Map([
  [['ArrowLeft', 'A', 'a'], { x: -1, y: 0 }],
  [['ArrowRight', 'D', 'd'], { x: 1, y: 0 }],
  [['ArrowUp', 'W', 'w'], { x: 0, y: -1 }],
  [['ArrowDown', 'S', 's'], { x: 0, y: 1 }]
]);

document.addEventListener('keydown', handleKeypress);
function handleKeypress(event) {
  let pressedKey = event.key;

  keyControls.forEach((direction, keys) => {
    if (keys.includes(pressedKey)) {
      event.preventDefault();
      console.log(direction);
      snake.changeDirection(direction);
    }
  });

  if (pressedKey === 'Escape') cancelAnimationFrame(mainLoop);
}
