import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as m from 'moment';
import { Subscription } from 'rxjs';

const moment = m;

export const IS_TIMEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsTimepickerComponent),
  multi: true
};

@Component({
  selector: 'is-timepicker',
  templateUrl: './is-timepicker.component.html',
  styleUrls: ['./is-timepicker.component.scss'],
  providers: [IS_TIMEPICKER_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsTimepickerComponent implements OnInit {

  @Input('placeholder') placeholder: string = '';

  @Output() changed: EventEmitter<Date> = new EventEmitter<Date>();

  public isOpened: boolean;
  public timeValue: Date;
  public viewValue: string = '';

  disabled: boolean;

  private el: any;
  private onTouched: Function;
  private _changeSubscription: Subscription = null;

  constructor(public viewContainer: ViewContainerRef, private changeDetector: ChangeDetectorRef) {
    this.viewContainer = viewContainer;
    this.el = viewContainer.element.nativeElement;
  }

  ngOnInit() {
    this.isOpened = false;
    this.initMouseEvents();
  }

  /**
  * Implemented as part of ControlValueAccessor.
  */
  writeValue(value: string | Date): void {
    if (!value) {
      this.timeValue = null;
      this.viewValue = '';
      return;
    }

    const time = typeof value === 'string' ? new Date(value) : value;
    this.setValue(time);
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

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }

  public closeTimepicker(): void {
    this.setValue(this.timeValue);
    this.isOpened = false;
    this.changeDetector.detectChanges();
  }

  public toggleTimepicker(): void {
    if (!this.disabled) {
      this.isOpened = !this.isOpened;
      if(!this.isOpened) {
        this.setValue(this.timeValue);
      }
      this.changeDetector.detectChanges();
    }
  }

  onChange($event: any) {
    this.setValue(this.timeValue);
  }

  private setValue(value: Date): void {
    let val = moment(value, 'HH:mm:ss');
    this.viewValue = val.format('HH:mm:ss');

    this.changed.emit(value);

    this.changeDetector.markForCheck();
  }

  private initMouseEvents(): void {
    let body = document.getElementsByTagName('body')[0];

    body.addEventListener('click', (e) => {
      if (!this.isOpened || !e.target) return;
      if (this.el !== e.target && !this.el.contains(e.target)) {
        this.closeTimepicker();
      }
    }, false);
  }
}
