import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [CommonModule],
    selector: 'xstate-tetris',
    standalone: true,
    styleUrls: ['./tetris.component.scss'],
    templateUrl: './tetris.component.html',
})
export class TetrisComponent implements OnInit {
    ngOnInit() {}
    buttonClicked() {
        console.log('clicked');
    }
}
