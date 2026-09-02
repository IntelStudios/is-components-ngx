import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input, HostBinding } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TIME_FORMAT, IsTimepickerComponent } from '@intelstudios/timepicker';
import { format, set } from 'date-fns';

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
    encapsulation: ViewEncapsulation.None,
    imports: [BsDatepickerModule, IsTimepickerComponent, ReactiveFormsModule],
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

  timepickerCtrl = new UntypedFormControl(null, Validators.required);

  constructor() { }

  ngOnInit() {
    if (this.value) {
      const dateValue = format(this.value, TIME_FORMAT);
      this.timepickerCtrl.setValue(dateValue);
    }
  }

  save(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    const { value } = this.timepickerCtrl;
    if (!value || !this.value) {
      return;
    }

    const [hours, minutes, seconds] = value.split(':');

    const dateValue = set(this.value, 
      { 
        hours : hours, 
        minutes : minutes, 
        seconds : seconds
      }
    )

    this.control.onChange(dateValue);
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


