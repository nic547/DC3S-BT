import { Directive, type ElementRef, type Renderer2 } from '@angular/core';

@Directive({
    selector: '[appArrowBackIcon]',
})
export class ArrowBackIconDirective {
    constructor(elementRef: ElementRef, renderer: Renderer2) {
        renderer.setProperty(
            elementRef.nativeElement,
            'innerHTML',
            '<svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="currentColor"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>',
        );
        renderer.addClass(elementRef.nativeElement, 'svg');
    }
}
