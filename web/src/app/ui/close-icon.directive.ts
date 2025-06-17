import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
    selector: '[appCloseIcon]',
})
export class CloseIconDirective {
    private readonly elementRef = inject(ElementRef);
    private readonly renderer = inject(Renderer2);

    constructor() {
        this.renderer.setProperty(
            this.elementRef.nativeElement,
            'innerHTML',
            '<svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>',
        );
        this.renderer.addClass(this.elementRef.nativeElement, 'svg');
    }
}
