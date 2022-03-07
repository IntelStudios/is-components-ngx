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
  ViewEncapsulation,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as m from 'moment';
import { Subscription } from 'rxjs';

const moment = m;

export const TIME_FORMAT = 'HH:mm:ss';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsTimepickerComponent implements OnInit, OnDestroy {

  @Input() allowClear: boolean = false;
  @Input('placeholder') placeholder: string = '';

  /**
   * when stringMode is enabled, expected and emitted date must be in Xeelo time format (HH:mm:ss)
   */
  @Input()
  stringMode: boolean = false;

  @Input()
  alignment: 'left' | 'center' | 'right' = 'left';

  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  public isOpened: boolean;
  public timeValue: Date;
  public viewValue: string = '';

  disabled: boolean;

  private el: any;
  private onTouched: Function;
  private _changeSubscription: Subscription = null;
  private _clickedOutsideListener = null;

  constructor(public viewContainer: ViewContainerRef, private renderer: Renderer2, private changeDetector: ChangeDetectorRef) {
    this.viewContainer = viewContainer;
    this.el = viewContainer.element.nativeElement;
  }

  ngOnInit() {
    this.isOpened = false;
  }

  ngOnDestroy() {
    this.unregisterOutsideClick();
  }

  /**
  * Implemented as part of ControlValueAccessor.
  */
  writeValue(value: string | Date): void {
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

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }

  closeTimepicker() {
    this.setValue(this.timeValue);
    this.isOpened = false;
    this.unregisterOutsideClick();
    this.changeDetector.detectChanges();
  }

  toggleTimepicker() {
    if (!this.disabled) {
      this.isOpened = !this.isOpened;
      if (!this.isOpened) {
        this.setValue(this.timeValue);
        this.unregisterOutsideClick();
      }
      else {
        this.registerOutsideClick();
        if (!this.timeValue) {
          this.setValue(new Date());
        }
      }

      this.changeDetector.detectChanges();
    }
  }

  onChange($event: any) {
    this.setValue(this.timeValue);
  }

  removeClick(event: any): void {
    event.stopPropagation();
    this.setValue(null);
  }

  private setValue(value: any): void {
    if (value) {
      if (this.stringMode && typeof value === 'string') {
        const input = value.split(':');
        let date = new Date();
        date.setHours(Number(input[0]));
        date.setMinutes(Number(input[1]));
        date.setSeconds(Number(input[2]));
        value = date;
      }

      const val = moment(value, TIME_FORMAT);
      this.viewValue = val.format(TIME_FORMAT);
      this.timeValue = value;

      this.changed.emit(this.stringMode ?  moment(value).format(TIME_FORMAT) : value);
    }
    else {
      this.viewValue = null;
      this.timeValue = null;

      this.changed.emit(null);
    }

    this.changeDetector.markForCheck();
  }

  private registerOutsideClick() {
    this._clickedOutsideListener = this.renderer.listen('document', 'click', (e: MouseEvent) => {
      if (!this.isOpened || !e.target) return;
      if (this.el !== e.target && !this.el.contains(e.target)) {
        this.closeTimepicker();
      }
    });
  }

  private unregisterOutsideClick() {
    this._clickedOutsideListener && this._clickedOutsideListener();
  }
}
