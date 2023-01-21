import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { tetrominosMatrices } from '../data';
import {
    PlayfieldMatrix,
    Tetromino,
    TetrominoColors,
    TetrominoName,
    TetrominosMatrix,
} from '../models';
import { StateService } from './state.service';

@Injectable()
export class TetrisService {
    private tetrominoSequence: TetrominoName[] = [];
    private playfield: PlayfieldMatrix = [];
    private currentTetromino!: Tetromino;

    private gameCanvas!: HTMLCanvasElement;
    private context!: CanvasRenderingContext2D;

    count = 0;
    grid = 32;
    rAF: number | null = null; // keep track of the animation frame so we can cancel it
    gameOver = false;

    _score$ = new BehaviorSubject<number>(0);

    constructor(private stateService: StateService) {}

    get score$(): Observable<number> {
        return this._score$.asObservable();
    }

    afterViewInit(gameCanvas: ElementRef<HTMLCanvasElement>) {
        this.gameCanvas = gameCanvas.nativeElement;
        const context = this.gameCanvas.getContext('2d');

        if (!context) {
            throw new Error('UNABLE_TO_GET_GAME_CANVAS_CONTEXT');
        }
        this.context = context;
    }
    startGame() {
        this._initializeGame();
        this.stateService.start();
    }

    playAgain() {
        this._initializeGame();
        this.stateService.playAgain();
    }

    private _initializeGame() {
        this._initializePlayfield();
        this._score$.next(0);
        this.currentTetromino = this._getNextTetromino();
        this.rAF = requestAnimationFrame(() => this._loop());
    }

    moveLeft() {
        const col = this.currentTetromino.col - 1;
        if (this._isValidMove(this.currentTetromino.matrix, this.currentTetromino.row, col)) {
            this.currentTetromino.col = col;
        }
    }

    moveRight() {
        const col = this.currentTetromino.col + 1;
        if (this._isValidMove(this.currentTetromino.matrix, this.currentTetromino.row, col)) {
            this.currentTetromino.col = col;
        }
    }

    rotateLeft() {
        let matrix = this._rotate90Clockwise(this.currentTetromino.matrix);
        matrix = this._rotate90Clockwise(this.currentTetromino.matrix);
        matrix = this._rotate90Clockwise(this.currentTetromino.matrix);
        if (this._isValidMove(matrix, this.currentTetromino.row, this.currentTetromino.col)) {
            this.currentTetromino.matrix = matrix;
            this.stateService.rotateLeft();
        }
    }

    rotateRight() {
        const matrix = this._rotate90Clockwise(this.currentTetromino.matrix);
        if (this._isValidMove(matrix, this.currentTetromino.row, this.currentTetromino.col)) {
            this.currentTetromino.matrix = matrix;
            this.stateService.rotateRight();
        }
    }

    drop() {
        const row = this.currentTetromino.row + 1;

        if (!this._isValidMove(this.currentTetromino.matrix, row, this.currentTetromino.col)) {
            this.currentTetromino.row = row - 1;

            this._placeTetromino();
            return;
        }

        this.currentTetromino.row = row;
    }

    private _initializePlayfield() {
        for (let row = -2; row < 20; row++) {
            this.playfield[row] = [];

            for (let col = 0; col < 10; col++) {
                this.playfield[row][col] = 0;
            }
        }
    }

    // eslint-disable-next-line complexity
    private _placeTetromino() {
        for (let row = 0; row < this.currentTetromino.matrix.length; row++) {
            for (let col = 0; col < this.currentTetromino.matrix[row].length; col++) {
                if (this.currentTetromino.matrix[row][col]) {
                    // game over if piece has any part offscreen
                    if (this.currentTetromino.row + row < 0) {
                        return this._showGameOver();
                    }

                    this.playfield[this.currentTetromino.row + row][
                        this.currentTetromino.col + col
                    ] = this.currentTetromino.name;
                }
            }
        }

        // check for line clears starting from the bottom and working our way up
        for (let row = this.playfield.length - 1; row >= 0; ) {
            if (this.playfield[row].every((cell) => !!cell)) {
                // drop every row above this one
                this._score$.next(this._score$.value + 1);

                for (let r = row; r >= 0; r--) {
                    for (let c = 0; c < this.playfield[r].length; c++) {
                        this.playfield[r][c] = this.playfield[r - 1][c];
                    }
                }
            } else {
                row--;
            }
        }

        this.currentTetromino = this._getNextTetromino();
    }

    private _showGameOver() {
        if (!this.rAF) {
            throw new Error('REQUEST_ANIMATION_FRAME_IS_NULL');
        }
        cancelAnimationFrame(this.rAF);
        this.stateService.end();
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

    private _rotate90Clockwise(matrix: TetrominosMatrix): TetrominosMatrix {
        const N = matrix.length - 1;
        const result = matrix.map((row, i) => row.map((val, j) => matrix[N - j][i]));

        return result;
    }

    // eslint-disable-next-line complexity
    private _isValidMove(matrix: TetrominosMatrix, cellRow: number, cellCol: number) {
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (
                    matrix[row][col] &&
                    // outside the game bounds
                    (cellCol + col < 0 ||
                        cellCol + col >= this.playfield[0].length ||
                        cellRow + row >= this.playfield.length ||
                        // collides with another piece
                        this.playfield[cellRow + row][cellCol + col])
                ) {
                    return false;
                }
            }
        }

        return true;
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

    // eslint-disable-next-line complexity
    private _loop() {
        this.rAF = requestAnimationFrame(() => this._loop());
        this.context.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        // draw the playfield
        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 10; col++) {
                if (this.playfield[row][col]) {
                    const name = this.playfield[row][col] as TetrominoName;
                    this.context.fillStyle = TetrominoColors[name];

                    // drawing 1 px smaller than the grid creates a grid effect
                    this.context.fillRect(
                        col * this.grid,
                        row * this.grid,
                        this.grid - 1,
                        this.grid - 1
                    );
                }
            }
        }

        // draw the active tetromino
        if (this.currentTetromino) {
            // this.currentTetromino falls every 35 frames
            if (++this.count > 35) {
                this.currentTetromino.row++;
                this.count = 0;

                // place piece if it runs into anything
                if (
                    !this._isValidMove(
                        this.currentTetromino.matrix,
                        this.currentTetromino.row,
                        this.currentTetromino.col
                    )
                ) {
                    this.currentTetromino.row--;
                    this._placeTetromino();
                }
            }

            this.context.fillStyle = TetrominoColors[this.currentTetromino.name];

            for (let row = 0; row < this.currentTetromino.matrix.length; row++) {
                for (let col = 0; col < this.currentTetromino.matrix[row].length; col++) {
                    if (this.currentTetromino.matrix[row][col]) {
                        // drawing 1 px smaller than the grid creates a grid effect
                        this.context.fillRect(
                            (this.currentTetromino.col + col) * this.grid,
                            (this.currentTetromino.row + row) * this.grid,
                            this.grid - 1,
                            this.grid - 1
                        );
                    }
                }
            }
        }
    }
}
