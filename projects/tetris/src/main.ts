import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { inspect } from '@xstate/inspect';

import { TetrisComponent } from './app/tetris/tetris.component';

inspect({
    // options
    // url: 'https://stately.ai/viz?inspect', // (default)
    iframe: false, // open in new window
});

createApplication({ providers: [] }).then((appRef) => {
    const xstateTetrisWidget = createCustomElement(
        TetrisComponent, // component for Angular element
        { injector: appRef.injector } // used to inject the component to the DOM
    );

    // register in a browser
    customElements.define('xstate-tetris', xstateTetrisWidget);
});
