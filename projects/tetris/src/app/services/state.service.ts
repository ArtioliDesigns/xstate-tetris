import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { assign, createMachine, interpret } from 'xstate';

interface Context {
    score: number;
}

@Injectable()
export class StateService {
    private tetrisMachine = createMachine<Context>({
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

    private interpreter = interpret(this.tetrisMachine).start();
    private _state$ = from(this.interpreter);

    constructor() {}

    get state$(): Observable<unknown> {
        return this._state$;
    }

    start() {
        this.interpreter.send('START');
    }
}
