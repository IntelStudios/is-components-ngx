import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[isPreventDblClick]'
  })
  export class PreventDoubleclickDirective {
  
    constructor(private el: ElementRef, private renderer: Renderer2) {
    }
  
    @HostListener('click')
    clickEvent() {
      this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
      setTimeout(() => {
        this.renderer.removeStyle(this.el.nativeElement, 'pointer-events');
      }, 250);
    }
  }