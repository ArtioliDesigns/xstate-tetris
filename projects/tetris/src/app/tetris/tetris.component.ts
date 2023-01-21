import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { StateFrom } from 'xstate';

import { HotKeysService, StateService, TetrisService } from '../services';

@Component({
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [CommonModule],
    selector: 'xstate-tetris',
    standalone: true,
    styleUrls: ['./tetris.component.scss'],
    templateUrl: './tetris.component.html',
    providers: [StateService, TetrisService, HotKeysService],
})
export class TetrisComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('gameCanvas') gameCanvas!: ElementRef<HTMLCanvasElement>;
    subscription: Subscription = new Subscription();
    state!: StateFrom<typeof this.stateService.tetrisMachine>;
    score!: number;

    constructor(
        private stateService: StateService,
        private tetrisService: TetrisService,
        private hotKeysService: HotKeysService
    ) {}

    ngOnInit() {
        this.subscription.add(
            this.stateService.state$.subscribe((state) => {
                this.state = state;
                console.log(state);
            })
        );

        this.subscription.add(
            this.hotKeysService.addShortcut$({ keys: 'f' }).subscribe(() => {
                this.tetrisService.rotateRight();
            })
        );

        this.subscription.add(
            this.hotKeysService.addShortcut$({ keys: 'd' }).subscribe(() => {
                this.tetrisService.rotateLeft();
            })
        );

        this.subscription.add(
            this.hotKeysService.addShortcut$({ keys: 'l' }).subscribe(() => {
                this.tetrisService.moveRight();
            })
        );

        this.subscription.add(
            this.hotKeysService.addShortcut$({ keys: 'j' }).subscribe(() => {
                this.tetrisService.moveLeft();
            })
        );

        this.subscription.add(
            this.hotKeysService.addShortcut$({ keys: 'k' }).subscribe(() => {
                this.tetrisService.drop();
            })
        );

        this.subscription.add(
            this.hotKeysService.addShortcut$({ keys: 'i' }).subscribe(() => {
                this.tetrisService.rotateRight();
            })
        );

        this.subscription.add(this.tetrisService.score$.subscribe((score) => (this.score = score)));
    }

    ngAfterViewInit() {
        this.tetrisService.afterViewInit(this.gameCanvas);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    start() {
        this.tetrisService.startGame();
    }

    playAgain() {
        this.tetrisService.playAgain();
    }
}
