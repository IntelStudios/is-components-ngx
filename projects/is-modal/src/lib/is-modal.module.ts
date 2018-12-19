import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IsModalComponent } from './is-modal.component';

@NgModule({
  imports: [
    CommonModule, ModalModule, TranslateModule
  ],
  declarations: [IsModalComponent],
  exports: [IsModalComponent],
  entryComponents: [IsModalComponent]
})
export class IsModalModule { }
