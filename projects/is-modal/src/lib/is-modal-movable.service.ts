import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Type } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { IsModalMovableComponent } from './is-modal-movable.component';
import { IsModalMovableConfig, IsModalMovableInstance, IsModalMovableRef } from './is-modal.interfaces';

@Injectable()
export class IsModalMovableService {

  isOpened: boolean;

  constructor(private over: Overlay) {

  }
  show(config: IsModalMovableConfig): IsModalMovableRef {

    return this.showComponent(IsModalMovableComponent, config, null);
  }

  showComponent(component: Type<IsModalMovableInstance>, config: IsModalMovableConfig, initialState?: any): IsModalMovableRef {
    if (this.isOpened) {
      return;
    }

    const positionStrategy = this.over.position().global()
      .left('0px')
      .top('0px');

      const overlayRef: OverlayRef = this.over.create(
      {
        minWidth: '1px',
        minHeight: '1px',
        positionStrategy: positionStrategy,
      }
    );

    const ref: IsModalMovableRef = {
      closed: false,
      close: () => {},
      center: () => {},
      onClosed$: overlayRef.detachments()
        .pipe(
          take(1),
          tap(() => ref.closed = true),
        )
    };

    const hide = () => {
      if (overlayRef) {
        overlayRef.detach();
        overlayRef.dispose();
        this.isOpened = false;
        ref.closed = true;
      }
    }
    ref.close = hide;

    const componentRef: ComponentRef<any> = overlayRef.attach(new ComponentPortal(component));
    const instanceRef: IsModalMovableInstance = componentRef.instance as IsModalMovableInstance;

    ref.center = () => {
      instanceRef.center();
    };

    instanceRef.control = {
      config: config,
      initialState: Object.assign({}, initialState),
      hide: hide
    };

    this.isOpened = true;

    componentRef.hostView.markForCheck();

    return ref;
  }
}
