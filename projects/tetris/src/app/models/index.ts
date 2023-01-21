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

export enum TetrominoColors {
    I = '#b8eff1',
    O = '#faea2f',
    T = '#Tb826b9',
    S = '#7bed66',
    Z = '#f61f30',
    J = '#0b56b3',
    L = '#fb7f22',
}

export interface Tetromino {
    name: TetrominoName;
    matrix: TetrominosMatrix;
    row: number;
    col: number;
}

export type PlayfieldMatrix = number[][];

export type TetrominosMatrix = number[][];
