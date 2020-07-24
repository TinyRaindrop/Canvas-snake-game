import { getRandomInt } from './util.js';
export class Food {
  constructor(color, grid, emptyCells) {
    this.color = color;
    this.grid = grid;
    this.position = { x: 0, y: 0 };
    this.updatePosition(emptyCells);
  }

  // Picks a random item from the set of available coordinates
  updatePosition([...emptyCells]) {
    let coordinates = emptyCells[getRandomInt(0, emptyCells.length - 1)];
    [this.position.x, this.position.y] = coordinates.split(':').map((c) => Number(c));
    console.log('Food', this.position);
  }

  draw(ctx) {
    let radius = Math.floor(this.grid.scale / 2);
    let x = this.position.x * this.grid.scale + radius;
    let y = this.position.y * this.grid.scale + radius;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
