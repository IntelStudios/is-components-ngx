import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { IsModalButtonConfig, IsModalConfig } from './is-modal.interfaces';

@Injectable()
export class IsModalMovableService {

  get isOpened(): boolean {
    return !!this.overlayRef;
  }

  private overlayRef: OverlayRef;
  private instanceRef: ComponentRef<any>;

  constructor(private over: Overlay) {

  }

  show(component: any, input: IsModalConfig, cssClass: string) {
    if (this.isOpened) {
      this.hide();

      return;
    }

    const positionStrategy = this.over.position().global()
      .centerHorizontally()
      .centerVertically();

      this.overlayRef = this.over.create(
      {
        minWidth: '200px',
        minHeight: '200px',
        positionStrategy: positionStrategy,
        //scrollStrategy: this.over.scrollStrategies.reposition()
      }
    );
    this.instanceRef = this.overlayRef.attach(new ComponentPortal(component));

    this.instanceRef.instance.control = {
      config: input,
      cssClass: cssClass,
      onButtonClicked: (btn: IsModalButtonConfig) => {
        console.log('btn clicked: ', btn);
        this.hide();
      }
    }

    // if (this.scrollListener) {
    //   let el: HTMLElement = this.element.nativeElement;
    //   let isAgViewportEl = false;
    //   while (el.parentElement && !isAgViewportEl) {
    //     isAgViewportEl = el.parentElement.className.indexOf('ag-body-viewport') > -1;
    //     el = el.parentElement;
    //   }

    //   if (isAgViewportEl) {
    //     this._scrollListener = this.renderer.listen(el, 'scroll', ($event: MouseEvent) => {
    //       if (this.actionsOpened) {
    //         this.optionsOverlayRef.updatePosition();
    //       }
    //     });
    //   }
    // }

    // this._clickedOutsideListener = this.renderer.listen('document', 'click', ($event: MouseEvent) => {
    //   if (this.actionsOpened) {
    //     let el: HTMLElement = <HTMLElement>$event.target;
    //     let isThisEl = false;
    //     while (el.parentElement && !isThisEl) {
    //       isThisEl = this.element.nativeElement === el || this.optionsInstanceRef.location.nativeElement === el;
    //       el = el.parentElement;
    //     }
    //     if (!isThisEl) {
    //       this.hideMenu();
    //     }
    //   }
    // });

    //this.changeDetector.markForCheck();
  }

  hide() {
    if (this.instanceRef) {
      this.instanceRef.destroy();
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = undefined;
      this.instanceRef = undefined;
    }
  }
}
