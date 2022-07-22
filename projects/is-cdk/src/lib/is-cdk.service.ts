import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ElementRef, Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { startWith, take, takeUntil, tap } from 'rxjs/operators';

const ZINDEX_STEP = 10;

export interface IsCdkBridgeControlOptions {
  /**
   * propagate value? (default true)
   */
  value?: boolean;
  /**
   * propagate status? (default true)
   */
  status?: boolean;
  /**
   * lazy binding (default false).
   * * When true, value + status propagation starts on source changes.
   * * When false, value + status propagation starts with current srource state
   */
  lazy?: boolean;
  targetValueOptions?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
}
  /**
   * destroy subject
   */
  ends$: Subject<unknown>;
}

@Injectable()
export class IsCdkService {

  private static overlayRefs: OverlayRef[] = [];

  constructor(private overlay: Overlay) {
  }

  static bridgeControl(source: AbstractControl, target: FormControl, opts: IsCdkBridgeControlOptions) {
    if (opts.value !== false) {
      source.valueChanges
        .pipe(
          opts.lazy === true ? tap() : startWith(source.value),
          takeUntil(opts.ends$),
        ).subscribe({
          next: (value) => target.setValue(value, opts.targetValueOptions),
        });
    }
    if (opts.status !== false) {
      source.statusChanges
        .pipe(
          opts.lazy === true ? tap() : startWith(source.status),
          takeUntil(opts.ends$),
        ).subscribe({
          next: (status) => {
            if (status === 'DISABLED' && target.enabled) {
              target.disable();
            } else if (target.disabled) {
              target.enable();
            }
          },
        });
    }
  }

  /**
   * Dispose (close) all previously created (and attached) overlayRefs
   */
  disposeAllOverlays() {
    IsCdkService.overlayRefs.forEach((ref) => {
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
    IsCdkService.overlayRefs.push(ref);
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
    IsCdkService.overlayRefs = IsCdkService.overlayRefs.filter((r) => r !== ref);
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
