import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IsDatepickerComponent } from '@intelstudios/datepicker';
import { IsInputSchemaFilter } from '../../is-input-mapping.interface';
import { IFilterDef } from '../../models';


@Component({
  selector: 'is-filter-editor',
  templateUrl: './is-filter-editor.component.html',
  styleUrls: ['./is-filter-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsFilterEditorComponent implements  AfterViewInit {

  @Input()
  filterDef: IFilterDef;

  @Output()
  onApply: EventEmitter<IsInputSchemaFilter> = new EventEmitter<IsInputSchemaFilter>();

  @ViewChild('focus', { static: false })
  focusedEl: ElementRef;

  ctrl = new FormControl();
  ctrl2 = new FormControl();

  constructor() {

  }

  ngAfterViewInit(): void {
    if (this.focusedEl) {
      if (this.focusedEl instanceof IsDatepickerComponent) {
        const datepicker = this.focusedEl as IsDatepickerComponent;
        setTimeout(() => datepicker.openPopup());
      }
      else {
        this.focusedEl.nativeElement.focus();
      }
    }
  }

  @HostListener('keydown.escape')
  cancel() {
    console.log('cancel')
    this.onApply.emit(null);
  }

  datepickerApply($event) {
    if ($event) {
      this.apply();
    }
  }

  apply() {
    setTimeout(() => {
      const value: IsInputSchemaFilter = {
        Type: this.filterDef.Type,
        Value: this.ctrl.value,
        Value2: this.ctrl2.value,
      };
      if (this.filterDef.InputType === 'date') {
        // remove time from date
        value.Value = this.removeTime(value.Value);
      } else if (this.filterDef.InputType === 'date-range') {
        value.Value = this.removeTime(value.Value);
        value.Value2 = this.removeTime(value.Value2);
      }
      this.onApply.emit(value);
    });
  }

  private removeTime(value: string) {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }

}
