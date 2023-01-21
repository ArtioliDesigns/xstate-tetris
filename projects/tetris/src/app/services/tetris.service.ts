import { Injectable } from '@angular/core';

import { tetrominosMatrices } from '../data';
import { PlayfieldMatrix, Tetromino, TetrominoName, TetrominosMatrix } from '../models';

@Injectable()
export class TetrisService {
    private tetrominoSequence: TetrominoName[] = [];
    private playfield: PlayfieldMatrix = [];

    constructor() {}

    startGame() {
        this._initializePlayfield();
    }

    private _initializePlayfield() {
        for (let row = -2; row < 20; row++) {
            this.playfield[row] = [];

            for (let col = 0; col < 10; col++) {
                this.playfield[row][col] = 0;
            }
        }
    }

    private _getNextTetromino(): Tetromino {
        if (this.tetrominoSequence.length === 0) {
            this._generateSequence();
        }

        const name = this.tetrominoSequence.pop();
        if (!name) {
            throw new Error('TETROMINO_SEQUENCE');
        }
        const matrix = tetrominosMatrices[name];

        // I and O start centered, all others start in left-middle
        const col = this.playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

        // I starts on row 21 (-1), all others start on row 22 (-2)
        const row = name === 'I' ? -1 : -2;

        return {
            name: name, // name of the piece (L, O, etc.)
            matrix: matrix, // the current rotation matrix
            row: row, // current row (starts offscreen)
            col: col, // current col
        };
    }

    private _generateSequence() {
        const sequence = [
            TetrominoName.I,
            TetrominoName.J,
            TetrominoName.L,
            TetrominoName.O,
            TetrominoName.S,
            TetrominoName.T,
            TetrominoName.Z,
        ];

        while (sequence.length) {
            const rand = this._getRandomInt(0, sequence.length - 1);
            const name = sequence.splice(rand, 1)[0];
            this.tetrominoSequence.push(name);
        }
    }

    private _getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
