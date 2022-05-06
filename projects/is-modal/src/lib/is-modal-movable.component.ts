import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

import { IsModalButtonConfig, IsModalMovableControl, IsModalMovableInstance, IsModalRef } from './is-modal.interfaces';
import { MovableModalComponent } from './movable/modal/modal.component';

@Component({
  selector: 'is-modal-movable',
  templateUrl: 'is-modal-movable.component.html',
  styleUrls: ['is-modal-movable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsModalMovableComponent implements OnInit, AfterViewInit, IsModalMovableInstance {

  control: IsModalMovableControl;

  @ViewChild('modal', { static: true })
  modal: MovableModalComponent;

  modalRef: IsModalRef;

  closed: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.modalRef = {
      close: () => {
        this.control.hide();
      }
    }

    if (this.control.config) {
      if (this.control.config.position) { // disable initial centering
        this.modal.executePostDisplayActions = false;
      }
      this.modal.show();
    }
  }

  center(): void {
    if (this.modal) {
      this.modal.center();
    }
  }

  ngAfterViewInit(): void {
    if (this.control.config?.position) {
      const modalEl = this.el.nativeElement.querySelector('div.ui-modal') as HTMLDivElement;
      const { position } = this.control.config;
      this.renderer.setStyle(modalEl, 'top', position.top);
      this.renderer.setStyle(modalEl, 'left', position.left);
    }
  }

  buttonClick(btn: IsModalButtonConfig) {
    btn.onClick && btn.onClick(this.modalRef);
    if (btn.autoClose !== false) {
      this.modalRef.close();
    }
  }

  closeModal($event) {
    if ($event) {
      this.modalRef.close();
    }
  }
}
