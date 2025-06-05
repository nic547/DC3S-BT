import { Directive, type ElementRef, type Renderer2 } from '@angular/core';

@Directive({
    selector: '[appAddIcon]',
})
export class AddIconDirective {
    constructor(elementRef: ElementRef, renderer: Renderer2) {
        renderer.setProperty(
            elementRef.nativeElement,
            'innerHTML',
            '<svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="currentColor"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>',
        );
        renderer.addClass(elementRef.nativeElement, 'svg');
    }
}
