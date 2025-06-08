import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
    selector: '[appArrowBackIcon]',
})
export class ArrowBackIconDirective {
    private readonly elementRef = inject(ElementRef);
    private readonly renderer = inject(Renderer2);

    constructor() {
        this.renderer.setProperty(
            this.elementRef.nativeElement,
            'innerHTML',
            '<svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="currentColor"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>',
        );
        this.renderer.addClass(this.elementRef.nativeElement, 'svg');
    }
}
