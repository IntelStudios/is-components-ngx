import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';

import { DatepickerPopupControl, defaultDatePickerConfig } from '../is-datepicker-popup/is-datepicker-popup.component';
import { configToken, IsDatepickerConfig } from '../is-datepicker.interfaces';
import { DATE_FORMAT, defaultDatePickerRootConfig } from '../is-datepicker/is-datepicker.component';

export const NG_DATEPICKER_INLINE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsDatepickerInlineComponent),
  multi: true
};

@Component({
  selector: 'is-datepicker-inline',
  templateUrl: './is-datepicker-inline.component.html',
  styleUrls: ['./is-datepicker-inline.component.scss'],
  providers: [NG_DATEPICKER_INLINE_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class IsDatepickerInlineComponent implements OnDestroy, ControlValueAccessor {

  /**
   * when stringMode is enabled, expected and emitted date must be in Xeelo date format (DD-MM-YYYY)
   */
  @Input()
  stringMode: boolean = false;

  /**
   * display date format (angular date pipe)
   */
  @Input()
  viewFormat: string;

  /**
   * ammends selected date to be End Of Day
   */
  @Input('isEOD') isEOD: boolean = false;

  /**
   * ammends selected date to be Start Of Day
   */
  @Input('isSOD') isSOD: boolean = false;

  /**
   * BsDatepicker config object to setup wrapped BsDatepickerInline component
   */
  @Input()
  config: Partial<BsDatepickerConfig> = defaultDatePickerConfig();

  rootConfig: IsDatepickerConfig = defaultDatePickerRootConfig();

  @Output()
  changed: EventEmitter<any> = new EventEmitter<any>();

  control: DatepickerPopupControl = {
    onChange: (value: Date) => {
      this.dateValue = value;
      this.onValueChange()
    }
  }

  dateValue: any = '';
  disabled: boolean = false;

  private _changeSubscription: Subscription = null;
  private onTouched: Function;

  constructor(
    @Optional() @Inject(configToken) dpConfig: IsDatepickerConfig,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.rootConfig = { ...this.rootConfig, ...dpConfig };
    // Properties didnt get their input values, yet
    this.viewFormat = this.rootConfig.viewFormat;
  }

  ngOnDestroy() {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
  }

  onValueChange() {
    if (this.dateValue) {
      let valid = !isNaN(this.dateValue.valueOf());
      if (!valid) {
        // if date is invalid then set up actual date
        this.dateValue = this.stripTimezone(new Date());
      }
    }
    if (this.dateValue === null) {
      this.changed.emit(null);
      this.changeDetector.markForCheck();
      return;
    }
    this.changed.emit(this.stringMode ? moment(this.dateValue).format(DATE_FORMAT) : this.dateValue);
    this.changeDetector.markForCheck();
  }


  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: string): void {
    if (!value) {
      this.dateValue = null;
      this.changeDetector.markForCheck();
      return;
    };
    this.setValue(value);
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnChange(fn: (_: any) => {}): void {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
    this._changeSubscription = this.changed.subscribe(fn);
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetector.markForCheck();
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }

  private setValue(value: string) {
    if (value) {
      const date = this.stringMode ? moment(value, DATE_FORMAT).local(true) : moment.utc(value).local(true);
      this.dateValue = date.toDate();
    }
    else {
      this.dateValue = null;
    }

    this.changeDetector.markForCheck();
  }

  private stripTimezone(date: Date): Date {
    if (!date) {
      return null;
    }

    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset);
  }

}

