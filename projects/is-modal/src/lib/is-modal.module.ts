import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IsModalComponent } from './is-modal.component';

@NgModule({
  imports: [
    CommonModule, ModalModule, TranslateModule, ScrollingModule
  ],
  declarations: [IsModalComponent],
  exports: [IsModalComponent],
  entryComponents: [IsModalComponent]
})
export class IsModalModule { }
