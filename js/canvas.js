import { getComputedStyleDimentions } from './util.js';

export class Canvas {
  constructor(selector, scale) {
    this.el = document.querySelector(selector);
    this.ctx = this.el.getContext('2d');
    this.grid = { columns: 0, rows: 0, scale };
    this.resizeCanvas();
  }

  resizeCanvas() {
    let canvasParent = this.el.parentElement;
    let canvasParentSize = getComputedStyleDimentions(canvasParent);
    this._calculateGridSize(canvasParentSize);
    this._fitCanvasToGrid();
  }

  _calculateGridSize(elementSize) {
    this.grid.columns = Math.floor(elementSize.width / this.grid.scale);
    this.grid.rows = Math.floor(elementSize.height / this.grid.scale);
    console.log('cells', this.grid);
  }

  _fitCanvasToGrid() {
    // Set canvas buffer dimentions
    this.el.width = this.grid.columns * this.grid.scale;
    this.el.height = this.grid.rows * this.grid.scale;
    // Set canvas element dimentions
    this.el.style.width = this.el.width.toString() + 'px';
    this.el.style.height = this.el.height.toString() + 'px';
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
  }

  drawGrid() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#333333';
    for (let column = 1; column < this.grid.columns; column++) {
      this.ctx.moveTo(column * this.grid.scale, 0);
      this.ctx.lineTo(column * this.grid.scale, canvas.height);
      this.ctx.stroke();
    }
    for (let row = 1; row < this.grid.rows; row++) {
      this.ctx.moveTo(0, row * this.grid.scale);
      this.ctx.lineTo(this.el.width, row * this.grid.scale);
      this.ctx.stroke();
    }
  }
}
