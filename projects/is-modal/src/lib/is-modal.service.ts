import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Type } from '@angular/core';
import { IsModalComponent } from './is-modal.component';
import { IsModalConfig, IsModalInstance, IsModalMovableConfig, IsModalRef } from './is-modal.interfaces';

@Injectable()
export class IsModalService {

  constructor(private over: Overlay) {

  }

  show(config: IsModalMovableConfig): IsModalRef {

    return this.showComponent(IsModalComponent, config);
  }

  showComponent(component: Type<IsModalInstance>, config: IsModalConfig): IsModalRef {

    const overlayRef: OverlayRef = this.over.create();

    const ref: IsModalRef = {
      close: () => { },
    };

    const hide = () => {
      if (overlayRef) {
        overlayRef.detach();
        overlayRef.dispose();
      }
    }
    ref.close = hide;

    const componentRef: ComponentRef<any> = overlayRef.attach(new ComponentPortal(component));
    const instanceRef = componentRef.instance as IsModalInstance;
    config.options = { show: true, ...config.options };

    instanceRef.control = {
      config: config,
      initialState: Object.assign({}, config.options?.initialState),
      hide: hide
    };

    componentRef.hostView.markForCheck();

    return ref;
  }
}
