import { Directive, inject, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appRemoveIcon]',
})
export class RemoveIconDirective {
    private elementRef = inject(ElementRef);
    private renderer = inject(Renderer2);

    constructor() {
        this.renderer.setProperty(
            this.elementRef.nativeElement,
            'innerHTML',
            '<svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="currentColor"><path d="M200-440v-80h560v80H200Z"/></svg>',
        );
        this.renderer.addClass(this.elementRef.nativeElement, 'svg');
    }
}
