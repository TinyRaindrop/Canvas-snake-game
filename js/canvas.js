import { getComputedStyleDimentions } from './util.js';

export class Canvas {
  constructor(selector, scale) {
    this.el = document.querySelector(selector);
    this.ctx = this.el.getContext('2d');
    this.grid = { columns: 0, rows: 0, scale };
    this.resizeCanvas();
    this.initPrerender();
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
    console.log('Grid', this.grid);
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

  initPrerender() {
    this.prerender = document.createElement('canvas');
    this.prerender.width = this.el.width;
    this.prerender.height = this.el.height;
    this.prerender.ctx = this.prerender.getContext('2d');
  }

  prerenderGrid() {
    let ctx = this.prerender.ctx;
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#333333';
    ctx.beginPath();
    for (let column = 1; column < this.grid.columns; column++) {
      ctx.moveTo(column * this.grid.scale + 0.5, 0.5);
      ctx.lineTo(column * this.grid.scale + 0.5, this.el.height + 0.5);
      ctx.stroke();
    }
    for (let row = 1; row < this.grid.rows; row++) {
      ctx.moveTo(0.5, row * this.grid.scale + 0.5);
      ctx.lineTo(this.el.width + 0.5, row * this.grid.scale + 0.5);
      ctx.stroke();
    }
  }

  drawGrid() {
    this.ctx.drawImage(this.prerender, 0, 0);
  }
}
