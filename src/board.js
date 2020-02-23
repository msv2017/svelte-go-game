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
    this.groupSequence = 1;
  }

  setRandom() {
    this.clear();
    this.updateCells(x => true, x => this.setCell(x.index, colorsArr[Math.random() * 3 | 0]));
  }

  getCell(pos) {
    return this.cells[pos];
  }

  setCell(pos, color) {
    if (color === colors.None) {
      return;
    }

    const cell = this.getCell(pos);
    cell.color = color;

    const cellsAround = this.getCellsAroundWithColor(pos, color);

    if (cellsAround.length > 0) {
      const groupsAround = this.toSet(cellsAround.map(x => x.group).sort());
      const firstGroup = groupsAround[0];
      cell.group = firstGroup;
      this.updateCells(x => groupsAround.includes(x.group), x => x.group = firstGroup);
    } else {
      cell.group = this.groupSequence++;
    }

    const groups = this.toSet(this.cells.map(x => x.group));
    groups.forEach(group => {
      if (!this.isGroupAlive(group)) {
        this.removeGroup(group);
      }
    })
  }

  toSet(arr) {
    return arr.reduce((a, x) => a.indexOf(x) !== -1 ? a : [...a, x], []);
  }

  isGroupAlive(group) {
    const emptyCells = this.cells.filter(cell => cell.group === group)
      .map(cell => this.getEmptyCellsAround(cell.index))
      .reduce((a, x) => [...a, ...x], [])
      .map(cell => cell.index)
      ;

    return this.toSet(emptyCells).length > 0;
  }

  removeGroup(group) {
    this.cells
      .filter(cell => cell.group === group)
      .forEach(cell => {
        cell.color = colors.None;
      });
  }

  getEmptyCellsAround(pos) {
    return this.getCellsAround(pos)
      .filter(x => x.color === colors.None);
  }

  getCellsAround(pos) {
    const arr = [];
    if (pos % this.cols > 0)
      arr.push(pos - 1);
    if ((pos % this.cols) < this.cols - 1)
      arr.push(pos + 1);
    if (pos - this.cols >= 0)
      arr.push(pos - this.cols);
    if (pos + this.cols < this.cells.length)
      arr.push(pos + this.cols);
    const result = arr
      .filter(x => x >= 0 && x < this.cells.length)
      .map(x => this.getCell(x));
    return result;
  }

  getCellsAroundWithColor(pos, color) {
    return this.getCellsAround(pos)
      .filter(x => x.color === color);
  }

  filterCells(predicate) {
    return this.cells.filter(predicate);
  }

  updateCells(predicate, action) {
    this.filterCells(predicate).forEach(action);
  }
}