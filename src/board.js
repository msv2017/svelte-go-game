import { range } from "./utils";

const colors = { None: 0, White: 1, Black: 2 };
const colorsArr = [colors.None, colors.White, colors.Black];
const noGroup = 0;

class Cell {
  constructor(index, color, group) {
    this.index = index;
    this.color = color;
    this.group = group;
  }

  get isWhite() {
    return this.color === colors.White;
  }

  get isBlack() {
    return this.color === colors.Black;
  }
}

export class Board {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.clear();
  }

  clear() {
    this.cells = range(0, this.cols * this.rows).map((x, i) => new Cell(i, colors.None, noGroup));
    this.groupAutoIncrement = 1;
  }

  setRandom() {
    this.clear();
    this.updateCells(x => true, x => this.setCell(x.index, colorsArr[Math.random() * 3 | 0]));
  }

  setTest() {
    this.clear();
    [0, 1, this.cols, this.cols + 1].forEach(x => this.setCell(x, colors.White));
  }

  getCell(pos) {
    return this.cells[pos];
  }

  setCell(pos, color) {
    const cell = this.getCell(pos);
    if (cell.color === colors.None && color !== colors.None) {
      cell.color = color;
      const cellsAround = this.getCellsAround(pos, color);
      if (cellsAround.length > 0) {
        const groupsAround = cellsAround.map(x => x.group).sort();
        const firstGroup = groupsAround[0];
        cell.group = firstGroup;
        this.updateCells(x => groupsAround.includes(x.group), x => x.group = firstGroup);
      } else {
        cell.group = this.groupAutoIncrement++;
      }
    }
  }

  getCellsAround(pos, color) {
    const arr = [];
    if (pos % this.cols > 0)
      arr.push(pos - 1);
    if ((pos % this.cols) < this.cols - 1)
      arr.push(pos + 1);
    if (pos - this.cols >= 0)
      arr.push(pos - this.cols);
    if (pos + this.cols < this.cells.length)
      arr.push(pos + this.cols);
    return arr
      .filter(x => x >= 0 && x < this.cells.length)
      .map(x => this.getCell(x))
      .filter(x => x.color === color);
  }

  filterCells(predicate) {
    return this.cells.filter(predicate);
  }

  updateCells(predicate, action) {
    this.filterCells(predicate).forEach(action);
  }
}