export interface TetrisGameContext {
    score: number;
}

export enum TetrominoName {
    I = 'I',
    J = 'J',
    L = 'L',
    O = 'O',
    S = 'S',
    T = 'T',
    Z = 'Z',
}

export interface Tetromino {
    name: TetrominoName;
    matrix: string;
    row: string;
    col: string;
}
