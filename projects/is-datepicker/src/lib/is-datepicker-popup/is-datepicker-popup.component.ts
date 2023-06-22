import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input, HostBinding } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import moment from 'moment';
import { TIME_FORMAT } from '@intelstudios/timepicker';

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
    }
  }
  get config(): Partial<BsDatepickerConfig> {
    return this._config;
  }
  private _config: Partial<BsDatepickerConfig> = defaultDatePickerConfig();

  @HostBinding('class.with-timepicker')
  @Input()
  withTimepicker = false;

  @Input()
  control: DatepickerPopupControl;

  @Input()
  value: Date;

  timepickerCtrl = new FormControl(null, Validators.required);

  constructor() { }

  ngOnInit() {
    if (this.value) {
      const dateValue = moment(this.value);
      this.timepickerCtrl.setValue(dateValue.format(TIME_FORMAT));
    }
  }

  save() {
    const { value } = this.timepickerCtrl;
    if (!value || !this.value) {
      return;
    }
    const dateValue = moment(this.value);
    const [hours, minutes, seconds] = value.split(':');
    dateValue.set({ hours, minutes, seconds });
    this.control.onChange(dateValue.toDate());
  }


  onValueChange($event: Date) {
    if ($event !== this.value) {
      if (this.withTimepicker) {
        this.value = $event;
      } else {
        this.control.onChange($event);
      }
    }

  }
}


