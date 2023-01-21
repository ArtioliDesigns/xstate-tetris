import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { assign, createMachine, interpret } from 'xstate';

import { TetrisGameContext } from '../models';

@Injectable()
export class StateService {
    public tetrisMachine = createMachine<TetrisGameContext>({
        id: 'tetris',
        initial: 'homescreen',
        context: {
            score: 0,
        },
        states: {
            homescreen: {
                on: {
                    START: 'playing',
                },
            },
            playing: {
                on: {
                    END: 'gameover',
                },
                initial: '0',
                states: {
                    0: {
                        on: {
                            ROTATE_RIGHT: { target: '90' },
                            ROTATE_LEFT: { target: '270' },
                        },
                    },
                    90: {
                        on: {
                            ROTATE_RIGHT: { target: '180' },
                            ROTATE_LEFT: { target: '0' },
                        },
                    },
                    180: {
                        on: {
                            ROTATE_RIGHT: { target: '270' },
                            ROTATE_LEFT: { target: '90' },
                        },
                    },
                    270: {
                        on: {
                            ROTATE_RIGHT: { target: '0' },
                            ROTATE_LEFT: { target: '180' },
                        },
                    },
                },
            },
            gameover: {
                on: {
                    PLAYAGAIN: {
                        target: 'playing',
                        actions: assign({
                            score: (context, event) => context.score + 1,
                        }),
                    },
                },
            },
        },
    });

    private interpreter = interpret(this.tetrisMachine, { devTools: true }).start();
    private _state$ = from(this.interpreter);

    constructor() {}

    get state$() {
        return this._state$;
    }

    start() {
        this.interpreter.send('START');
    }

    end() {
        this.interpreter.send('END');
    }

    rotateRight() {
        this.interpreter.send('ROTATE_RIGHT');
    }

    rotateLeft() {
        this.interpreter.send('ROTATE_LEFT');
    }
}
