import { Canvas } from './canvas.js';
import { Snake } from './snake.js';
import { Food } from './food.js';
import { isMobile } from './util.js';

const UPDATE_TIME = 120;
const GRID_SCALE = 33; // Pixels per grid square
const SNAKE_LENGTH = 3; // Starting snake length, [1..n]
const SNAKE_COLOR = { head: '#7733bb', tail: '#0095DD' };
const FOOD_COLOR = '#e58864';
const FOOD_AMOUNT = 1;

let game;
let gameState; // loaded > active > finished
let lastUpdateTimestamp = 0;
let lastAnimateTimestamp = 0;
let sinceLastUpdate = 0;
let sinceLastAnimate = 0;
let score = 0;

const touchControls = document.querySelector('.touch-controls');

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

loadGame();
function loadGame() {
  draw();

  document.addEventListener('keydown', handleKeypress);
  if (isMobile) touchControls.addEventListener('touchstart', handleTouch);

  gameState = 'loaded';
  game = requestAnimationFrame(gameLoop);
}

function stopGame() {
  gameState = 'finished';
  cancelAnimationFrame(game);
}

let animationDistance = 0;
let lastFrameDuration = 0;
function gameLoop(currentTimestamp) {
  sinceLastUpdate = currentTimestamp - lastUpdateTimestamp;

  if (gameState === 'active') {
    if (sinceLastUpdate > UPDATE_TIME) {
      update();
      draw();
      lastUpdateTimestamp = currentTimestamp;
      lastFrameDuration = sinceLastUpdate;
    } else if (animationDistance * canvas.grid.scale >= 1) {
      draw();
      snake.animate(canvas.ctx, animationDistance);
      lastAnimateTimestamp = currentTimestamp;
    }
    animationDistance = (currentTimestamp - lastUpdateTimestamp) / lastFrameDuration;

    // logFrameTime(sinceLastAnimate);
    // displayFPS(sinceLastRender);
  }

  game = requestAnimationFrame(gameLoop);
}

function update() {
  snake.updateDirection();
  snake.move();
  snake.detectCollision();
  if (!snake.alive) {
    stopGame();
    return;
  }
  if (snake.eat(food)) {
    snake.grow();
    food.updatePosition(getEmptyCells());
    setScore(score + 1);
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
    UPDATE_TIME.toFixed(3),
    '| FPS',
    (1000 / frameTime).toFixed(1)
  );
}

// Display text
const scoreElement = document.querySelector('.score > .value');
function setScore(value) {
  score = value;
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

function handleKeypress(event) {
  if (!gameStateAllowsToPlay()) return;
  directionControls.forEach((keys, directionName) => {
    if (keys.includes(event.keyCode)) {
      event.preventDefault();
      snake.bufferInputCommand(directionMap.get(directionName));
    }
  });

  if (event.key === 'Escape') stopGame();
}

function displayTouchControls() {
  touchControls.style.display = 'flex';
}

function handleTouch(event) {
  if (!gameStateAllowsToPlay()) return;
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

function gameStateAllowsToPlay() {
  if (gameState === 'finished') {
    return false;
  } else if (gameState === 'loaded') {
    gameState = 'active';
  }
  return true;
}
