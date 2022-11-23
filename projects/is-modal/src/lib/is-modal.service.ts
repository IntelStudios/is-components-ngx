import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Type } from '@angular/core';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { IsCdkService } from '@intelstudios/cdk';
import { defer, merge, Observable, Subject } from 'rxjs';
import { first, map, mapTo } from 'rxjs/operators';
import { IsModalComponent } from './is-modal.component';
import { IsDialogComponent, IsModalConfig, IsModalInstance, IsModalMovableConfig, IsModalRef } from './is-modal.interfaces';

type ObservableGeneric<T> = T extends Observable<infer X> ? X : never;

@Injectable()
export class IsModalService {

  constructor(private isCdk: IsCdkService) {

  }

  show<T extends IsDialogComponent<T['input'], ObservableGeneric<T['output']>>>(component: Type<T>, input: T['input'], options?: Partial<ModalOptions>): T['output'] {
    const ouptutSubject = new Subject<ObservableGeneric<T['output']>>();
    return defer(() => {
      const config: ModalOptions = {
        ...{ ignoreBackdropClick: true, show: true },
        ...options,
      };

      const overlayRef = this.isCdk.create({ disposeOnNavigation: true });
      const cRef = overlayRef.attach(new ComponentPortal(component));
      const modalComponent = cRef.instance;
      modalComponent.input = input;
      modalComponent.output = ouptutSubject;
      modalComponent.modalConfig = config;
      cRef.hostView.markForCheck();

      if (!modalComponent.modal) {
        throw new Error('DialogComponent must have [modal] ViewChild initialzied');
      }

      const detached$ = overlayRef.detachments().pipe(mapTo(null));
      const hidden$ = modalComponent.modal.onHide.pipe(mapTo(null));

      return merge(modalComponent.output, hidden$, detached$)
        .pipe(
          first(),
          map((value) => {
            console.log('Closing modal', value);
            modalComponent.modal.hide();
            overlayRef.dispose();
            return value;
          }),
        );
    });
  }


  showMovable(config: IsModalMovableConfig): IsModalRef {
    return this.showComponent(IsModalComponent, config);
  }

  showComponent(component: Type<IsModalInstance>, config: IsModalConfig): IsModalRef {

    const overlayRef: OverlayRef = this.isCdk.create(config.panelCssClass ? { panelClass: config.panelCssClass } : null);

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
      initialState: Object.assign({}, config.options.initialState),
      hide: hide
    };

    componentRef.hostView.markForCheck();

    return ref;
  }
}
