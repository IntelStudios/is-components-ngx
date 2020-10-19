import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsDatepickerComponent } from './is-datepicker/is-datepicker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { IsDatepickerPopupComponent } from './is-datepicker-popup/is-datepicker-popup.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IsDatepickerInlineComponent } from './is-datepicker-inline/is-datepicker-inline.component';
import { configToken, IsDatepickerConfig } from './is-datepicker.interfaces';

@NgModule({
  imports: [
    CommonModule, BsDatepickerModule, ReactiveFormsModule, OverlayModule, ScrollingModule
  ],
  declarations: [IsDatepickerComponent, IsDatepickerPopupComponent, IsDatepickerInlineComponent],
  exports: [IsDatepickerComponent, IsDatepickerInlineComponent],
  entryComponents: [IsDatepickerPopupComponent]
})
export class IsDatepickerModule {
  static forRoot(config?: IsDatepickerConfig): ModuleWithProviders<IsDatepickerModule> {
    return {
      ngModule: IsDatepickerModule,
      providers: [
        { provide: configToken, useValue: config }
      ]
    }
  }
}
