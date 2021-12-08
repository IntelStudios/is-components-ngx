import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { IsIFrameResizeDirective } from './directives/iframe-resize.directive';
import { PreventDoubleclickDirective } from './directives/prevent-dblclick.directive';
import { IsIFrameClickDirective } from './directives/iframe-click.directive';
import { IsCdkService } from './is-cdk.service';

@NgModule({
  imports: [
    CommonModule, OverlayModule,
  ],
  declarations: [IsIFrameResizeDirective, PreventDoubleclickDirective, IsIFrameClickDirective],
  exports: [IsIFrameResizeDirective, PreventDoubleclickDirective, IsIFrameClickDirective],
  providers: [IsCdkService],
})
export class IsCdkModule { }
