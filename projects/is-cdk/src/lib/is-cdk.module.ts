import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { IsCdkService } from './is-cdk.service';
import { IsIFrameResizeDirective } from './directives/iframe-resize.directive';
import { PreventDoubleclickDirective } from './directives/prevent-dblclick.directive';
@NgModule({
  imports: [
    CommonModule, OverlayModule,
  ],
  declarations: [IsIFrameResizeDirective, PreventDoubleclickDirective],
  exports: [IsIFrameResizeDirective, PreventDoubleclickDirective],
  providers: [IsCdkService]
})
export class IsCdkModule { }
