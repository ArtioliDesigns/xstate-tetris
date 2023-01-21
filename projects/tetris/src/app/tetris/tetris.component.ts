import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { StateService } from '../services/state.service';

@Component({
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [CommonModule],
    selector: 'xstate-tetris',
    standalone: true,
    styleUrls: ['./tetris.component.scss'],
    templateUrl: './tetris.component.html',
    providers: [StateService],
})
export class TetrisComponent implements OnInit, OnDestroy {
    subscription: Subscription = new Subscription();

    constructor(private stateService: StateService) {}
    ngOnInit() {
        this.subscription.add(
            this.stateService.state$.subscribe((state) => {
                console.log(state);
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
