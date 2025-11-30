import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  readonly rows: number = 10;
  readonly cols: number = 10;
  gameBoard: string[][] = Array.from({ length: this.rows }, () =>
    Array.from({ length: this.cols }, () => 'empty')
  );
  Math = Math

  constructor() {
    this.createBoard();
  }

  createBoard(): void {
    this.gameBoard = [];

    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        row.push('e');
      }
      this.gameBoard.push(row);
    }
  }

  reset(): void {
    this.gameBoard = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => 'empty')
    );
  }
}
