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
export class IsFilterEditorComponent implements AfterViewInit {

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
      const { InputType, Type } = this.filterDef;
      if (InputType === 'date') {
        // remove time from date
        value.Value = this.getDate(value.Value);
      } else if (InputType === 'date-range') {
        value.Value = this.getDate(value.Value);
        value.Value2 = this.getDate(value.Value2);
      }
      if (InputType !== 'none' && !value.Value) {
        return;
      }
      if (InputType === 'text' && Type.endsWith('In')) {
        value.Value = this.cleanupInNotInSeparators(value.Value);
      }
      this.onApply.emit(value);
    });
  }

  private cleanupInNotInSeparators(value: string): string {
    if (!value) {
      return value;
    }
    return value.replace(/;/g, ',')
      .split(',')
      .filter(x => !!x)
      .join(',');
  }

  private getDate(value: string) {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    return date.toISOString();
  }

}
