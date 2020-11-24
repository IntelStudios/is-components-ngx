import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Input, Type } from '@angular/core';
import { IsModalMovableComponent } from './is-modal-movable.component';
import { IsModalMovableConfig, IsModalMovableInstance, IsModalMovableRef } from './is-modal.interfaces';

@Injectable()
export class IsModalMovableService {

  constructor(private over: Overlay) {

  }

  show(config: IsModalMovableConfig): IsModalMovableRef {

    return this.showComponent(IsModalMovableComponent, config, null);
  }

  showComponent(component: Type<IsModalMovableInstance>, config: IsModalMovableConfig, initialState?: any): IsModalMovableRef {
    const positionStrategy = this.over.position().global()
      .centerHorizontally()
      .centerVertically();

      const overlayRef: OverlayRef = this.over.create(
      {
        minWidth: '200px',
        minHeight: '200px',
        positionStrategy: positionStrategy,
      }
    );

    const ref: IsModalMovableRef = {
      closed: false,
      close: () => {}
    };

    const hide = () => {
      if (overlayRef) {
        overlayRef.detach();
        overlayRef.dispose();
        ref.closed = true;
      }
    }
    ref.close = hide;

    const componentRef: ComponentRef<any> = overlayRef.attach(new ComponentPortal(component));
    const instanceRef: IsModalMovableInstance = componentRef.instance as IsModalMovableInstance;

    instanceRef.control = {
      config: config,
      initialState: Object.assign({}, initialState),
      hide: hide
    };

    componentRef.hostView.markForCheck();

    return ref;
  }
}
