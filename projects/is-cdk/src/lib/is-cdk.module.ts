import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { IsCdkService } from './is-cdk.service';
import { IsIFrameResizeDirective } from './directives/iframe-resize.directive';
@NgModule({
  imports: [
    CommonModule, OverlayModule,
  ],
  declarations: [IsIFrameResizeDirective],
  exports: [IsIFrameResizeDirective],
  providers: [IsCdkService]
})
export class IsCdkModule { }
