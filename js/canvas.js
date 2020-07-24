import { getComputedStyleDimentions } from './util.js';

export class Canvas {
  constructor(selector, scale) {
    this.el = document.querySelector(selector);
    this.ctx = this.el.getContext('2d');
    this.grid = { columns: 0, rows: 0, scale };
    this.resizeCanvas();
    this._initBuffer();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
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
    // Actual canvas resolution
    this.el.width = this.grid.columns * this.grid.scale;
    this.el.height = this.grid.rows * this.grid.scale;
    // CSS dimentions
    this.el.style.width = this.el.width.toString() + 'px';
    this.el.style.height = this.el.height.toString() + 'px';
  }

  _initBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.ctx = this.buffer.getContext('2d');
  }

  _setOffCanvasSize(offCanvas, width, height) {
    offCanvas.width = width;
    offCanvas.height = height;
  }

  prerenderGrid() {
    this.renderedGrid = document.createElement('canvas');
    this._setOffCanvasSize(this.renderedGrid, this.el.width, this.el.height);
    this._setOffCanvasSize(this.buffer, this.el.width, this.el.height);

    this.drawGrid(this.buffer.ctx, this.grid, {
      width: this.el.width,
      height: this.el.height
    });

    this.renderedGrid.getContext('2d').drawImage(this.buffer, 0, 0);
  }

  drawGrid(ctx, grid, dimentions) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#333333';
    ctx.beginPath();
    for (let column = 1; column < grid.columns; column++) {
      ctx.moveTo(column * grid.scale + 0.5, 0.5);
      ctx.lineTo(column * grid.scale + 0.5, dimentions.height + 0.5);
      ctx.stroke();
    }
    for (let row = 1; row < grid.rows; row++) {
      ctx.moveTo(0.5, row * grid.scale + 0.5);
      ctx.lineTo(dimentions.width + 0.5, row * grid.scale + 0.5);
      ctx.stroke();
    }
  }
}
