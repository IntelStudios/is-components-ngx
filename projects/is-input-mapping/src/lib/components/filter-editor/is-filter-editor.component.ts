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

  apply() {
    setTimeout(() => {
      this.onApply.emit({
        Type: this.filterDef.Type,
        Value: this.ctrl.value,
        Value2: this.ctrl2.value,
      });
    });
  }

}
