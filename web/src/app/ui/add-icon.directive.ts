import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
    selector: '[appAddIcon]',
})
export class AddIconDirective {
    private readonly elementRef = inject(ElementRef);
    private readonly renderer = inject(Renderer2);

    constructor() {
        this.renderer.setProperty(
            this.elementRef.nativeElement,
            'innerHTML',
            '<svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="currentColor"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>',
        );
        this.renderer.addClass(this.elementRef.nativeElement, 'svg');
    }
}
