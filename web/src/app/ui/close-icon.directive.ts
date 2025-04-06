import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCloseIcon]'
})
export class CloseIconDirective {

  constructor(elementRef: ElementRef, renderer: Renderer2) {
    renderer.setProperty(elementRef.nativeElement, 'innerHTML', '<svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>');
    renderer.addClass(elementRef.nativeElement, 'svg');
  }
}


