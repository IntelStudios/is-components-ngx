import { Component, OnInit, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IsModalButtonConfig } from './is-modal.interfaces';

@Component({
  selector: 'is-modal',
  templateUrl: 'is-modal.component.html',
  styleUrls: ['is-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsModalComponent implements OnInit {

  template: TemplateRef<any>;
  title: string;
  buttonsLeft: IsModalButtonConfig[];
  buttonsRight: IsModalButtonConfig[];
  bodyScroll: boolean = true;

  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
  }

  buttonClick(btn: IsModalButtonConfig) {
    btn.onClick && btn.onClick();
    if (btn.autoClose !== false) {
      this.modalRef.hide();
    }
  }

}
