import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

export interface TimepickerOptionsControl {
  timeValue: Date;
  onChange: (value: Date) => void;
}

@Component({
    selector: 'is-timepicker-picker',
    templateUrl: './is-timepicker-picker.component.html',
    styleUrls: ['./is-timepicker-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [TimepickerModule, FormsModule],
})
export class IsTimepickerPickerComponent implements OnInit {

  control: TimepickerOptionsControl;

  public timeValue: Date;

  constructor() {
  }

  ngOnInit() {
    this.timeValue = this.control.timeValue;
  }

  onChange(value: Date) {
    this.control.onChange(value);
  }
}
