import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRemoveIcon]'
})
export class RemoveIconDirective {

  constructor (elementRef: ElementRef, renderer: Renderer2) {
    renderer.setProperty(elementRef.nativeElement, 'innerHTML', '<svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="currentColor"><path d="M200-440v-80h560v80H200Z"/></svg>');
    renderer.addClass(elementRef.nativeElement, 'svg');
  }

}
