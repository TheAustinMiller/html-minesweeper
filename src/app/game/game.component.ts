import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent {
  readonly rows: number = 10;
  readonly cols: number = 10;
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
    this.clicks++;
    if (this.clicks == 1) {
      this.placeMines(row, col);
    }
    this.sweptBoard[row][col] = "swept";
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
    this.gameBoard = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ' ')
    );
    this.sweptBoard = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => "unswept")
    );
    this.mineBoard = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ' ')
    );
    this.clicks = 0;
    this.mines = 10;
  }
}