import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { IsModalButtonConfig, IsModalConfig, IsModalControl, IsModalInstance, IsModalRef } from './is-modal.interfaces';

@Component({
  selector: 'is-modal',
  templateUrl: 'is-modal.component.html',
  styleUrls: ['is-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsModalComponent implements OnInit, IsModalInstance {

  @ViewChild(ModalDirective, { static: true })
  modal: ModalDirective;

  control: IsModalControl;

  config: IsModalConfig;

  template: TemplateRef<any>;
  title: string;
  buttonsLeft: IsModalButtonConfig[];
  buttonsRight: IsModalButtonConfig[];
  bodyScroll: boolean = true;

  constructor() { }

  ngOnInit() {
    this.config = this.control.config;
  }

  buttonClick(btn: IsModalButtonConfig) {
    btn.onClick && btn.onClick();
    if (btn.autoClose !== false) {
      this.control.hide();
    }
  }
}
