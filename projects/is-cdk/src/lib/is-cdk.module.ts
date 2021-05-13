import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { IsCdkService } from './is-cdk.service';
@NgModule({
  imports: [
    CommonModule, OverlayModule,
  ],
  providers: [IsCdkService]
})
export class IsCdkModule { }
