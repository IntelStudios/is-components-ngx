import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ElementRef, Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

const ZINDEX_STEP = 10;

@Injectable()
export class IsCdkService {

  private overlayRefs: OverlayRef[] = [];

  constructor(private overlay: Overlay) {

  }

  /**
   * Dispose (close) all previously created (and attached) overlayRefs
   */
  disposeAllOverlays() {
    this.overlayRefs.forEach((ref) => {
      ref.dispose();
    })
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
    this.overlayRefs.push(ref);
    ref.detachments()
      .pipe(
        take(1)
      ).subscribe({
        next: () => {
          this.unsetOverlayRef(ref);
        }
      });
    return ref;
  }

  private unsetOverlayRef(ref: OverlayRef) {
    this.overlayRefs = this.overlayRefs.filter((r) => r !== ref);
  }

  private adjustZindex(parentElement: ElementRef<HTMLElement>, element: HTMLElement): void {
    let currentEl = parentElement.nativeElement;
    element.style.zIndex = `${ZINDEX_STEP}`;
    while (currentEl) {
      const zIndex = IsCdkService.getStyle(currentEl, 'z-index');
      if (zIndex && zIndex !== 'auto') {
        element.style.zIndex = `${Number(zIndex) + ZINDEX_STEP}`;
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
