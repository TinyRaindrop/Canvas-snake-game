import { getRandomInt } from './util.js';
export class Food {
  constructor(grid) {
    this.grid = grid;
    this.color = '#33DD88';
    this.updatePosition();
  }

  updatePosition() {
    this.position = this._getRandomPosition();
    console.log('Food', this.position);
  }

  _getRandomPosition() {
    return {
      x: getRandomInt(0, this.grid.columns - 1),
      y: getRandomInt(0, this.grid.rows - 1)
    };
  }

  draw(ctx) {
    let radius = Math.round(this.grid.scale / 2);
    let x = this.position.x * this.grid.scale + radius;
    let y = this.position.y * this.grid.scale + radius;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }
}
