import { Directive, inject, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appDownloadIcon]',
})
export class DownloadIconDirective {
    private elementRef = inject(ElementRef);
    private renderer = inject(Renderer2);
    
    constructor( ) {
        this.renderer.setProperty(
            this.elementRef.nativeElement,
            'innerHTML',
            '<svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="currentColor"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>',
        );
        this.renderer.addClass(this.elementRef.nativeElement, 'svg');
    }
}
