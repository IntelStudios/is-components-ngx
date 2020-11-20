import { ChangeDetectionStrategy, Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { IsModalButtonConfig, IsModalRef } from './is-modal.interfaces';

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
  modalRef: IsModalRef;

  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.modalRef = {
      close: () => {
        this.bsModalRef.hide();
      }
    }
  }

  buttonClick(btn: IsModalButtonConfig) {
    btn.onClick && btn.onClick(this.modalRef);
    if (btn.autoClose !== false) {
      this.modalRef.close();
    }
  }

}
