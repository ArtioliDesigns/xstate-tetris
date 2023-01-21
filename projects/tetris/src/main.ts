import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

import { TetrisComponent } from './app/tetris/tetris.component';

createApplication({ providers: [] }).then((appRef) => {
    const xstateTetrisWidget = createCustomElement(
        TetrisComponent, // component for Angular element
        { injector: appRef.injector } // used to inject the component to the DOM
    );

    // register in a browser
    customElements.define('xstate-tetris', xstateTetrisWidget);
});
