import { Canvas } from './canvas.js';
import { Snake } from './snake.js';
import { Food } from './food.js';

const FRAME_TIME = 7 * (1000 / 60) - 1; // Milliseconds bettween re-renders
const GRID_SCALE = 30; // Pixels per grid square
const SNAKE_LENGTH = 3; // Starting snake length, [1..n]
const FOOD_AMOUNT = 1;
let score = 0;

const canvas = new Canvas('#canvas', GRID_SCALE);
const snake = new Snake(SNAKE_LENGTH, canvas.grid);
const food = new Food(canvas.grid);

// TODO: prevent food from spawning on snake. Use Set?
let availableCells = [];

canvas.prerenderGrid();
draw();

let gameStarted = false;
let lastRenderTime = 0;
let mainLoop = requestAnimationFrame(render);

function render(currentTimestamp) {
  let sinceLastRender = currentTimestamp - lastRenderTime;

  if (gameStarted) {
    if (sinceLastRender > FRAME_TIME) {
      // logFrameTime(sinceLastRender);
      displayFPS(sinceLastRender);

      update();
      draw();

      lastRenderTime = currentTimestamp;
    }
  }

  mainLoop = requestAnimationFrame(render);
}

function update() {
  snake.updateDirection();
  snake.move();
  // snake.logCoordinates();
  snake.detectCollision(canvas.grid);
  if (snake.eat(food)) {
    snake.grow();
    food.updatePosition();
    score++;
    updateScore();
  }
}

function draw() {
  canvas.clearCanvas();
  canvas.drawGrid();

  snake.draw(canvas.ctx, canvas.grid);
  food.draw(canvas.ctx);
  // food.draw();
}

function logFrameTime(frameTime) {
  console.log(
    'frame',
    frameTime.toFixed(3),
    '| goal',
    FRAME_TIME.toFixed(3),
    '| FPS',
    (1000 / frameTime).toFixed(1)
  );
}

const scoreElement = document.querySelector('.score > .value');
function updateScore() {
  scoreElement.innerHTML = score;
}

const fpsElement = document.querySelector('.fps > .value');
function displayFPS(frameTime) {
  let fps = Math.round(1000 / frameTime);
  fpsElement.innerHTML = fps;
}

const directionControls = new Map([
  [['ArrowLeft', 'A', 'a'], { name: 'left', x: -1, y: 0 }],
  [['ArrowRight', 'D', 'd'], { name: 'right', x: 1, y: 0 }],
  [['ArrowUp', 'W', 'w'], { name: 'up', x: 0, y: -1 }],
  [['ArrowDown', 'S', 's'], { name: 'down', x: 0, y: 1 }]
]);

document.addEventListener('keydown', handleKeypress);
function handleKeypress(event) {
  if (!gameStarted) {
    draw();
    gameStarted = true;
    return;
  }

  let pressedKey = event.key;

  directionControls.forEach((direction, keys) => {
    if (keys.includes(pressedKey)) {
      event.preventDefault();
      // console.log('key =', direction.name);
      snake.bufferInputCommand(direction);
    }
  });

  if (pressedKey === 'Escape') cancelAnimationFrame(mainLoop);
}
