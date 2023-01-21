import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Subject } from 'rxjs';

export interface HotKeysOptions {
    element?: HTMLElement;
    target?: 'document';
    keys: string;
}

@Injectable()
export class HotKeysService {
    defaults: Partial<HotKeysOptions> = {
        target: 'document',
    };
    constructor(@Inject(DOCUMENT) private document: Document, private eventManager: EventManager) {}

    addShortcut$(options: HotKeysOptions) {
        const mergedOptions = { ...this.defaults, ...options };
        // https://github.com/angular/angular/blob/master/packages/platform-browser/src/dom/events/key_events.ts
        const event = `keydown.${mergedOptions.keys}`;
        const _eventSubscription: Subject<Event> = new Subject();

        if (mergedOptions.element) {
            this.eventManager.addEventListener(
                mergedOptions.element as HTMLElement,
                event,
                (handlerEvent: Event) => {
                    handlerEvent.preventDefault();
                    _eventSubscription.next(handlerEvent);
                }
            );
        } else {
            this.eventManager.addEventListener(
                this.document.documentElement,
                event,
                (handlerEvent: Event) => {
                    handlerEvent.preventDefault();
                    _eventSubscription.next(handlerEvent);
                }
            );
        }

        return _eventSubscription.asObservable();
    }
}
