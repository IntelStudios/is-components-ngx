import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, DatePipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxMaskModule } from 'ngx-mask';

import { IsDatepickerInlineComponent } from './is-datepicker-inline/is-datepicker-inline.component';
import { IsDatepickerPopupComponent } from './is-datepicker-popup/is-datepicker-popup.component';
import { configToken, IsDatepickerConfig } from './is-datepicker.interfaces';
import { IsDatepickerComponent } from './is-datepicker/is-datepicker.component';

@NgModule({
  imports: [
    CommonModule, BsDatepickerModule, ReactiveFormsModule, OverlayModule, ScrollingModule, NgxMaskModule.forRoot(),
  ],
  providers: [DatePipe],
  declarations: [IsDatepickerComponent, IsDatepickerPopupComponent, IsDatepickerInlineComponent],
  exports: [IsDatepickerComponent, IsDatepickerInlineComponent],
  entryComponents: [IsDatepickerPopupComponent]
})
export class IsDatepickerModule {
  static forRoot(config?: IsDatepickerConfig): ModuleWithProviders<IsDatepickerModule> {
    return {
      ngModule: IsDatepickerModule,
      providers: [
        { provide: configToken, useValue: config },
      ]
    }
  }
}
