import { Injectable } from '@angular/core';

@Injectable()
export class TetrisService {
    private tetrominoSequence = [];

    constructor() {}

    private _getNextTetromino() {
        if (this.tetrominoSequence.length === 0) {
            this._generateSequence();
        }

        // const name = tetrominoSequence.pop();
        // const matrix = tetrominos[name];

        // // I and O start centered, all others start in left-middle
        // const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

        // // I starts on row 21 (-1), all others start on row 22 (-2)
        // const row = name === 'I' ? -1 : -2;

        // return {
        //     name: name, // name of the piece (L, O, etc.)
        //     matrix: matrix, // the current rotation matrix
        //     row: row, // current row (starts offscreen)
        //     col: col, // current col
        // };
    }

    private _generateSequence() {}
}
