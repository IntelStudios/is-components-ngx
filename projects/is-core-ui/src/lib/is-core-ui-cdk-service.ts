import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, Injectable, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { IsCoreUICdkOutput } from './is-core-ui.interfaces';

@Injectable()
export class IsCoreUICdkService {

  constructor(private over: Overlay) {

  }

  createCdkOverlay(overlay: Overlay, component: any, config?: OverlayConfig, elementRef?: ElementRef, renderer?: Renderer2): IsCoreUICdkOutput {
    const overlayRef: OverlayRef = overlay.create(config);

    const componentRef: ComponentRef<any> = overlayRef.attach(new ComponentPortal(component));

    if (elementRef && renderer) {
      const xx = window.getComputedStyle(elementRef.nativeElement);
      console.log('xx', xx.zIndex);
      renderer.setStyle(componentRef.location.nativeElement, 'z-index', '9999', RendererStyleFlags2.Important);
    }

    return {
      overlayRef: overlayRef,
      componentRef: componentRef
    };
  }
}
