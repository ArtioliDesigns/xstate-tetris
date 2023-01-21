import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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
export class TetrisComponent implements OnInit, OnDestroy {
    subscription: Subscription = new Subscription();
    state!: StateFrom<typeof this.stateService.tetrisMachine>;
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
            this.hotKeysService.addShortcut$({ keys: 'l' }).subscribe(() => {
                this.stateService.rotateRight();
            })
        );

        this.subscription.add(
            this.hotKeysService.addShortcut$({ keys: 'j' }).subscribe(() => {
                this.stateService.rotateLeft();
            })
        );
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    buttonClicked() {
        this.stateService.start();
    }
}
