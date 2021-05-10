import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalComponent } from 'ng-modal-lib';

import { IsModalButtonConfig, IsModalMovableControl, IsModalMovableInstance, IsModalRef } from './is-modal.interfaces';

@Component({
  selector: 'is-modal-movable',
  templateUrl: 'is-modal-movable.component.html',
  styleUrls: ['is-modal-movable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsModalMovableComponent implements OnInit, IsModalMovableInstance {

  control: IsModalMovableControl;

  @ViewChild('modal', { static: true })
  modal: ModalComponent;

  modalRef: IsModalRef;

  closed: boolean = false;

  constructor() { }

  ngOnInit() {
    this.modalRef = {
      close: () => {
        this.control.hide();
      }
    }

    if (this.control.config) {
      this.modal.show();
    }
  }

  center(): void {
    if (this.modal) {
      this.modal.center();
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
