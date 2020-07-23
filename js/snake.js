import { getRandomInt, getRandomSign } from './util.js';

export class Snake {
  constructor(ctx, grid, length) {
    this.ctx = ctx;
    this.grid = grid;
    this.length = length > 1 ? length : 1;
    this.direction = this._getRandomDirection();
    this.head = this._getRandomStartPosition(grid);
    this.tail = this._createTail();

    this.log();
  }

  log() {
    console.log(this.head, this.direction, this.tail);
  }

  _getRandomDirection() {
    return getRandomSign() > 0
      ? { x: getRandomSign(), y: 0 } // left or right
      : { x: 0, y: getRandomSign() }; // up or down
  }

  // Returns Head position such that Body doesn't touch borders
  _getRandomStartPosition(grid) {
    let range = {};
    range.left = 1 + (this.direction.x > 0 ? this.length - 1 : 0);
    range.right = grid.width - 2 - (this.direction.x < 0 ? this.length - 1 : 0);
    range.top = 1 + (this.direction.y > 0 ? this.length - 1 : 0);
    range.bottom = grid.height - 2 - (this.direction.y < 0 ? this.length - 1 : 0);

    if (range.left > range.right || range.top > range.bottom) {
      console.log(range);
      console.log('Snake doesnt fit!');
    }
    let startX = getRandomInt(range.left, range.right);
    let startY = getRandomInt(range.top, range.bottom);
    return { x: startX, y: startY };
  }

  _createTail() {
    let tail = [];
    for (let i = 1, j = 1; tail.length < this.length - 1; i++, j++) {
      tail.push({
        x: this.head.x - this.direction.x * i,
        y: this.head.y - this.direction.y * j
      });
    }
    return tail;
  }

  draw(grid) {
    this.ctx.fillStyle = '#7065DD';
    this.ctx.fillRect(
      this.head.x * grid.scale,
      this.head.y * grid.scale,
      grid.scale,
      grid.scale
    );
    this.ctx.fillStyle = '#0095DD';
    this.tail.forEach((segment) => {
      this.ctx.fillRect(
        segment.x * grid.scale,
        segment.y * grid.scale,
        grid.scale,
        grid.scale
      );
    });
  }

  move() {
    this.head.x += this.direction.x;
    this.head.y += this.direction.y;
    [this.head.x, this.head.y] = this._goThroughWalls(this.head);
    this.tail.forEach((segment) => {
      segment.x += this.direction.x;
      segment.y += this.direction.y;
      [segment.x, segment.y] = this._goThroughWalls(segment);
    });
  }

  _goThroughWalls(segment) {
    if (segment.x < 0) segment.x = this.grid.width - 1;
    if (segment.x > this.grid.width - 1) segment.x = 0;
    if (segment.y < 0) segment.y = this.grid.height - 1;
    if (segment.y > this.grid.height - 1) segment.y = 0;
    return [segment.x, segment.y];
  }

  changeDirection(newDirection) {
    this.direction = newDirection;
  }
}
