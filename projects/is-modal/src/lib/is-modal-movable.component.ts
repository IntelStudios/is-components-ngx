import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';

import { IsModalButtonConfig, IsModalConfig, IsModalRef } from './is-modal.interfaces';

export interface MovableModalControl {
  config: IsModalConfig;
  cssClass: string;
  onButtonClicked: (btn: IsModalButtonConfig) => void;
}

@Component({
  selector: 'is-modal-movable',
  templateUrl: 'is-modal-movable.component.html',
  styleUrls: ['is-modal-movable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsModalMovableComponent implements OnInit {

  control: MovableModalControl;

  config: IsModalConfig;

  cssClass: string;

  modalRef: IsModalRef;

  @ViewChild('modal', { static: true })
  modal: any;

  constructor() { }

  ngOnInit() {
    this.config = this.control.config;
    this.cssClass = this.control.cssClass;

    this.modalRef = {
      close: () => {
        this.modal.hide();
      }
    }

    if (this.config) {
      this.modal.show();
    }
  }

  buttonClick(btn: IsModalButtonConfig) {
    btn.onClick && btn.onClick(this.modalRef);
    if (btn.autoClose !== false) {
      this.modalRef.close();
    }
  }
}
