import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { IsModalButtonConfig, IsModalMovableControl, IsModalRef } from './is-modal.interfaces';

@Component({
  selector: 'is-modal-movable',
  templateUrl: 'is-modal-movable.component.html',
  styleUrls: ['is-modal-movable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsModalMovableComponent implements OnInit {

  control: IsModalMovableControl;

  @ViewChild('modal', { static: true })
  modal: any;

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
