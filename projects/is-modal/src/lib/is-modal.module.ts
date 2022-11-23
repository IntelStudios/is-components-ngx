import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IsModalComponent } from './is-modal.component';
import { IsModalMovableComponent } from './is-modal-movable.component';
import { IsModalMovableService } from './is-modal-movable.service';
import { Overlay } from '@angular/cdk/overlay';
import { IsModalService } from './is-modal.service';
import { ResizableModule } from './movable/resizable/resizable-module';
import { DraggableModule } from './movable/draggable/draggable-module';
import { MovableModalComponent } from './movable/modal/modal.component';
import { IsCdkModule } from 'projects/is-cdk/src/public-api';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    ResizableModule,
    DraggableModule,
    TranslateModule,
    ScrollingModule,
    IsCdkModule,
  ],
  declarations: [
    IsModalComponent,
    IsModalMovableComponent,
    MovableModalComponent,
  ],
  exports: [
    IsModalComponent,
    IsModalMovableComponent,
    MovableModalComponent,
  ],
  providers: [IsModalMovableService, Overlay, IsModalService]
})
export class IsModalModule { }
