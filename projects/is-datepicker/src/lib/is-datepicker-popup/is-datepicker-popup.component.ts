import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

export interface DatepickerPopupControl {
  onChange: (value: Date) => void;
}

export const defaultDatePickerConfig = () => ({
  showWeekNumbers: false,
  selectFromOtherMonth: true,
  customTodayClass: 'today'
  });

@Component({
  selector: 'is-datepicker-popup',
  templateUrl: './is-datepicker-popup.component.html',
  styleUrls: ['./is-datepicker-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsDatepickerPopupComponent implements OnInit {

  @Input()
  set config(value: Partial<BsDatepickerConfig>) {
    if (value) {
      Object.assign(this._config, value);
      console.log(this._config);
    }
  }
  get config(): Partial<BsDatepickerConfig> {
    return this._config;
  }
  private _config: Partial<BsDatepickerConfig> = defaultDatePickerConfig();

  @Input()
  control: DatepickerPopupControl;

  @Input()
  value: Date;

  constructor() { }

  ngOnInit() {

  }

  onValueChange($event: Date) {
    if ($event !== this.value) {
      this.control.onChange($event);
    }

  }
}
