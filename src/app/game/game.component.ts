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
  readonly colors: string[] = ["", "blue", "green", "red", "darkblue", "brown", "cyan", "black", "gray"];
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
  flagBoard = Array.from({ length: this.rows }, () =>
    Array(this.cols).fill('')
  );
  adjacencyBoard: number[][] = Array.from({ length: this.rows }, () =>
    Array(this.cols).fill(0)
  );

  Math = Math;

  constructor() {
    this.createBoard();
  }

  displayItem(row: number, col: number): string {
    return this.gameBoard[row][col];
  }

  sweep(row: number, col: number): void {
    if (this.flagBoard[row][col] === '🚩') return;
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
        if (adjacentMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const r = row + dr;
              const c = col + dc;
              if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.sweptBoard[r][c] === 'unswept') {
                this.sweep(r, c);
              }
            }
          }
        }

      }
    }
    // Check for win
    if (!this.gameOver && this.checkWin()) {
      this.gameOver = true;
      alert('Congratulations! You won!');
    }
  }

  checkWin(): boolean {
    if (this.sweptBoard.flat().filter(cell => cell === 'unswept').length === this.mines) {
      return true;
    }
    return false;
  }

  calculateAdjacentMines(row: number, col: number): number {
    let count = 0;
    for (const key of this.getNeighbors(row, col)) {
      const [r, c] = key.split(',').map(Number);
      if (this.mineBoard[r][c] === '💣') count++;
    }
    this.adjacencyBoard[row][col] = count;
    return count;
  }


  placeMines(initialRow: number, initialCol: number): void {
    const forbidden = this.getNeighbors(initialRow, initialCol);

    while (this.mines > 0) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);

      const key = `${r},${c}`;

      if (!forbidden.has(key) && this.mineBoard[r][c] !== "💣") {
        this.mineBoard[r][c] = "💣";
        this.mines--;
      }
    }
    this.mines = 10;
  }

  private getNeighbors(row: number, col: number) {
    const cells = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (
          r >= 0 && r < this.rows &&
          c >= 0 && c < this.cols
        ) {
          cells.push(`${r},${c}`);
        }
      }
    }
    return new Set(cells);
  }

  flag(event: MouseEvent, row: number, col: number): void {
    event.preventDefault();

    if (!this.gameOver && this.sweptBoard[row][col] === 'swept') return;

    if (!this.gameOver && this.flagBoard[row][col] === '🚩') {
      this.gameBoard[row][col] = ' ';
      this.flagBoard[row][col] = '';
    } else {
      this.flagBoard[row][col] = '🚩';
      this.gameBoard[row][col] = '🚩';
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
    this.flagBoard = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill('')
    );
    this.adjacencyBoard = Array.from({ length: this.rows }, () =>
    Array(this.cols).fill(0)
  );

    this.createBoard();
  }
}