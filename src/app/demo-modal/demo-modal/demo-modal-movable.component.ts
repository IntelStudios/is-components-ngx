import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input } from '@angular/core';
import { ModalComponent } from 'ng-modal-lib';
import { IsModalMovableControl, IsModalMovableInstance, IsModalRef } from 'projects/is-modal/src/public_api';

@Component({
  selector: 'app-demo-modal-movable',
  templateUrl: './demo-modal-movable.component.html',
  styleUrls: ['./demo-modal-movable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoModalMovableComponent implements OnInit, IsModalMovableInstance {

  control: IsModalMovableControl;

  @ViewChild('modal', { static: true })
  modal: ModalComponent;

  modalRef: IsModalRef;

  closed: boolean = false;

  constructor() {

  }

  ngOnInit(): void {
    this.modal.show();
  }

  center(): void {
    if (this.modal) {
      this.modal.center();
    }
  }

  saveClick() {
    console.log('Save button click');
  }
}
