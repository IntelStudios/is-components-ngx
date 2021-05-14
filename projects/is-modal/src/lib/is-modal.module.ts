import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalModule as ModalLibModule } from 'ng-modal-lib';
import { IsModalComponent } from './is-modal.component';
import { IsModalMovableComponent } from './is-modal-movable.component';
import { IsModalMovableService } from './is-modal-movable.service';
import { Overlay } from '@angular/cdk/overlay';
import { IsModalService } from './is-modal.service';

@NgModule({
  imports: [
    CommonModule, ModalModule, ModalLibModule, TranslateModule, ScrollingModule
  ],
  declarations: [IsModalComponent, IsModalMovableComponent],
  exports: [IsModalComponent, IsModalMovableComponent],
  providers: [IsModalMovableService, Overlay, IsModalService],
  entryComponents: [IsModalComponent, IsModalMovableComponent]
})
export class IsModalModule { }
