import { Canvas } from './canvas.js';
import { Snake } from './snake.js';
import { Food } from './food.js';

// TODO: run at max fps with smooth animations
const FRAME_TIME = 7 * (1000 / 60) - 1; // Milliseconds bettween re-renders
const GRID_SCALE = 33; // Pixels per grid square
const SNAKE_LENGTH = 3; // Starting snake length, [1..n]
const SNAKE_COLOR = { head: '#7733bb', tail: '#0095DD' };
const FOOD_COLOR = '#e58864';
const FOOD_AMOUNT = 1;

let gameActive = false;
let score = 0;

const touchControls = document.querySelector('.touch-controls');
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);
if (isMobile) displayTouchControls();

const canvasElement = document.getElementById('canvas');
const canvas = new Canvas(canvasElement, GRID_SCALE);

canvas._initBuffer();
canvas.prerenderGrid();

// Set of all possible coordinates on the game grid
let gridCellCount = canvas.grid.columns * canvas.grid.rows;
let gridCells = new Set(
  [...Array(gridCellCount).keys()].map((i) => {
    return `${i % canvas.grid.columns}:${i % canvas.grid.rows}`;
  })
);

const snake = new Snake(SNAKE_LENGTH, SNAKE_COLOR, canvas.grid);
const food = new Food(FOOD_COLOR, canvas.grid, getEmptyCells());

draw();

let lastTimestamp = 0;
let game = requestAnimationFrame(gameLoop);

function gameLoop(currentTimestamp) {
  let sinceLastRender = currentTimestamp - lastTimestamp;

  if (gameActive) {
    if (sinceLastRender > FRAME_TIME) {
      update();
      draw();

      // logFrameTime(sinceLastRender);
      displayFPS(sinceLastRender);
      lastTimestamp = currentTimestamp;
    }
  }
  game = requestAnimationFrame(gameLoop);
}

function update() {
  snake.updateDirection();
  snake.move();
  snake.detectCollision();
  if (!snake.alive) {
    gameActive = false;
    return;
  }
  if (snake.eat(food)) {
    snake.grow();
    food.updatePosition(getEmptyCells());
    score++;
    updateScore();
  }
}

function draw() {
  canvas.clearCanvas();
  canvas.ctx.drawImage(canvas.renderedGrid, 0, 0);

  food.draw(canvas.ctx);
  snake.draw(canvas.ctx);
}

function getEmptyCells() {
  let emptyCells = new Set(gridCells);
  emptyCells.delete(`${snake.head.x}:${snake.head.y}`);
  snake.tail.forEach((segment) => emptyCells.delete(`${segment.x}:${segment.y}`));
  return emptyCells;
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

// Display text
const scoreElement = document.querySelector('.score > .value');
function updateScore() {
  scoreElement.innerHTML = score;
}

const fpsElement = document.querySelector('.fps > .value');
function displayFPS(frameTime) {
  let fps = Math.round(1000 / frameTime);
  fpsElement.innerHTML = fps;
}

// Handle input commands
const directionControls = new Map([
  ['left', [37, 65]],
  ['right', [39, 68]],
  ['up', [38, 87]],
  ['down', [40, 83]]
]);

const directionMap = new Map([
  ['left', { name: 'left', x: -1, y: 0 }],
  ['right', { name: 'right', x: 1, y: 0 }],
  ['up', { name: 'up', x: 0, y: -1 }],
  ['down', { name: 'down', x: 0, y: 1 }]
]);

// Start game on keypress and stop on Escape
document.addEventListener('keydown', handleKeypress);

function handleKeypress(event) {
  if (!gameActive) gameActive = true;

  directionControls.forEach((keys, directionName) => {
    if (keys.includes(event.keyCode)) {
      event.preventDefault();
      console.log('input:', directionName);
      snake.bufferInputCommand(directionMap.get(directionName));
    }
  });

  if (event.key === 'Escape') cancelAnimationFrame(game);
}

function displayTouchControls() {
  touchControls.style.display = 'flex';
}

touchControls.addEventListener('touchstart', handleTouch);
function handleTouch(event) {
  if (!gameActive) gameActive = true;
  console.log(event);

  let newDirection;
  if (event.target.classList.contains('left')) {
    newDirection = getTouchDirection(-1); // counterclockwise
  } else if (event.target.classList.contains('right')) {
    newDirection = getTouchDirection(1); // clockwise
  }
  snake.bufferInputCommand(newDirection);
}

function getTouchDirection(turn) {
  let x = snake.direction.x;
  let y = snake.direction.y;
  if (x === 0) {
    x = -y * turn;
    y = 0;
  } else if (y === 0) {
    y = x * turn;
    x = 0;
  }
  console.log(snake.direction);
  return { name: snake.direction.name, x, y };
}

function resetGame() {}
