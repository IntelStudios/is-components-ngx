import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ElementRef, Injectable } from '@angular/core';

@Injectable()
export class IsCdkService {

  constructor(private overlay: Overlay) {

  }


/**
 * create @angular/cdk overlayRef
 * @param config configuration
 * @param parentEl optional parent element. if set, created OverlayRef will get higher z-index than parent element (or it's first recursive parent which has some)
 * @returns 
 */
  create(config: OverlayConfig, parentEl?: ElementRef<HTMLElement>): OverlayRef {
    const ref = this.overlay.create(config);
    if (parentEl) {
      this.adjustZindex(parentEl, ref.hostElement)
    }
    return ref;
  }

  private adjustZindex(parentElement: ElementRef<HTMLElement>, element: HTMLElement): void {
    let currentEl = parentElement.nativeElement;
    while (currentEl) {
      const zIndex = IsCdkService.getStyle(currentEl, 'z-index');
      if (zIndex && zIndex !== 'auto') {
        element.style.zIndex = `${Number(zIndex) + 1}`;
        break;
      }
      currentEl = currentEl.parentElement;
    }
  }

  private static getStyle(el: HTMLElement, styleProp: string): string {
    if (window.getComputedStyle) {
      return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    } else {
      return el.style.getPropertyValue(styleProp);
    }
  } 
}
