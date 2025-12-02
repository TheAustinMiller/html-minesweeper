import { Component, ViewEncapsulation } from '@angular/core';
import { min } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent {
  readonly rows: number = 10;
  readonly cols: number = 10;
  gameOver: boolean = false;
  mines: number = 10;
  clicks = 0;
  gameBoard: string[][] = Array.from({ length: this.rows }, () =>
    Array.from({ length: this.cols }, () => ' ')
  );
  mineBoard: string[][] = Array.from({ length: this.rows }, () =>
    Array.from({ length: this.cols }, () => ' ')
  );
  sweptBoard: string[][] = Array.from({ length: this.rows }, () =>
    Array.from({ length: this.cols }, () => "unswept")
  );
  Math = Math;

  constructor() {
    this.createBoard();
  }

  displayItem(row: number, col: number): string {
    return this.gameBoard[row][col];
  }

  sweep(row: number, col: number): void {
    if (!this.gameOver && this.sweptBoard[row][col] === "unswept") {
      this.clicks++;
      if (this.clicks == 1) {
        this.placeMines(row, col);
      }
      this.sweptBoard[row][col] = "swept";
      // Check if there is a mine
      if (this.mineBoard[row][col] === '💣') {
        for (let r = 0; r < this.rows; r++) {
          for (let c = 0; c < this.cols; c++) {
            if (this.mineBoard[r][c] === '💣') {
              this.gameBoard[r][c] = '💣';
            }
          }
        }
        this.gameBoard[row][col] = '💥';
        this.gameOver = true;
      } else {
        // If not, reveal the number of adjacent mines
        let adjacentMines = this.calculateAdjacentMines(row, col);
        if (adjacentMines > 0) { this.gameBoard[row][col] = adjacentMines.toString(); }
      }
    }


    // If there are no adjacent mines, recursively sweep adjacent cells (TODO)
    // Check for win
  }

  calculateAdjacentMines(row: number, col: number): number {
    let mineCount = 0;
    let xLeft = col - 1;
    let xRight = col + 1;
    let yTop = row - 1;
    let yBottom = row + 1;

    if (xLeft != -1 && yTop != -1 && this.mineBoard[yTop][xLeft] === '💣') mineCount++;
    if (yTop != -1 && this.mineBoard[yTop][col] === '💣') mineCount++;
    if (xRight != this.cols && yTop != -1 && this.mineBoard[yTop][xRight] === '💣') mineCount++;
    if (xLeft != -1 && this.mineBoard[row][xLeft] === '💣') mineCount++;
    if (xRight != this.cols && this.mineBoard[row][xRight] === '💣') mineCount++;
    if (yBottom != this.rows && xLeft != -1 && this.mineBoard[yBottom][xLeft] === '💣') mineCount++;
    if (yBottom != this.rows && this.mineBoard[yBottom][col] === '💣') mineCount++;
    if (yBottom != this.rows && xRight != this.cols && this.mineBoard[yBottom][xRight] === '💣') mineCount++;

    return mineCount;
  }

  placeMines(initialRow: number, initialCol: number): void {
    while (this.mines > 0) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);

      if (!(this.mineBoard[r][c] === '💣') && !(r === initialRow && c === initialCol)) {
        this.mineBoard[r][c] = '💣';
        this.mines--;
      }
    }
  }

  createBoard(): void {
    this.gameBoard = [];

    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        row.push(' ');
      }
      this.gameBoard.push(row);
    }
  }

  reset(): void {
    this.gameOver = false;
    this.mines = 10;
    this.clicks = 0;
    this.gameBoard = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ' ')
    );
    this.mineBoard = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ' ')
    );
    this.sweptBoard = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => "unswept")
    );
    this.createBoard();
  }
}