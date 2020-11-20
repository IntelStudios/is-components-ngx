import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as m from 'moment';
import { Subscription } from 'rxjs';

import { IsTimepickerPickerComponent } from './is-timepicker-picker.component';

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

  @ViewChild('input', { static: true })
  input: ElementRef;

  get pickerOpened(): boolean {
    return !!this.pickerOverlayRef;
  }

  private pickerOverlayRef: OverlayRef;
  private pickerInstanceRef: ComponentRef<IsTimepickerPickerComponent>;

  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  public timeValue: Date;
  public viewValue: string = '';

  timeControl: FormControl;
  disabled: boolean;
  active: boolean;

  private onTouched: Function;
  private _changeSubscription: Subscription = null;
  private _clickedOutsideListener = null;
  private _detachSub: Subscription;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private overlay: Overlay,
    private changeDetector: ChangeDetectorRef) {
    this.timeControl = new FormControl();
  }

  ngOnInit(): void {
    const timeValidator = (control: AbstractControl) => {
      const invalid = { 'dateInvalid': true };
      const value = control.value;

      if (value && typeof value === 'string') {
        const match = value.match(/^(?:(?:([01]?\d|2[0-3]):)([0-5]\d):)([0-5]\d)$/);

        if (!match) {
          return invalid;
        }
      }

      return null;
    };

    this.timeControl.setValidators(timeValidator);
  }

  ngOnDestroy() {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
    if (this._detachSub) {
      this._detachSub.unsubscribe();
    }
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

  hidePicker() {
    if (this.pickerInstanceRef) {
      this.pickerOverlayRef.detach();
    }
  }

  onInputValueChange($event: string): void {
    if (this.timeControl.invalid) {
      // if time is invalid, result value will be null
      this.changed.emit(null);
      this.changeDetector.markForCheck();
      return;
    }

    this.setValue($event);
  }

  onPickerShown() {
    if (this.disabled) {
      return;
    }

    if (this.pickerOpened) {
      this.hidePicker();

      return;
    }

    const rect: DOMRect = this.element.nativeElement.getBoundingClientRect();
    const pickerHeight = 114;
    const pickerWidth = 278;
    const isDropup = rect.bottom + pickerHeight > window.innerHeight;
    const dropUpClass = isDropup ? ' is-timepicker-popup-dropup' : '';

    const position: ConnectedPosition = isDropup ?
      { originY: 'top', originX: 'end', overlayX: 'end', overlayY: 'bottom' }
      : { originY: 'bottom', originX: 'end', overlayX: 'end', overlayY: 'top' };

    const wouldOverflowLeft = pickerWidth - rect.width > rect.left;
    if (wouldOverflowLeft) {
      position.originX = 'start';
      position.overlayX = 'start';
    }

    const positionStrategy = this.overlay.position().flexibleConnectedTo(this.element)
      .withPositions([position])
      .withPush(true);

    this.pickerOverlayRef = this.overlay.create(
      {
        minWidth: `${pickerWidth}px`,
        minHeight: `${pickerHeight}px`,
        positionStrategy: positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close()
      }
    );
    this.pickerInstanceRef = this.pickerOverlayRef.attach(new ComponentPortal(IsTimepickerPickerComponent));
    const classes = this.element.nativeElement.className.replace(/ng-[\w-]+/g, ' ').trim() + dropUpClass;
    this.renderer.setAttribute(this.pickerInstanceRef.location.nativeElement, 'class', classes);

    // subscribe to detach event
    // overlay can be detached by us (calling closePopup()) or by reposition strategy
    // we need to cleanup things
    this._detachSub = this.pickerOverlayRef.detachments().subscribe(() => {
      // console.log('overlay detached');
      this.pickerInstanceRef.destroy();
      this.pickerOverlayRef.dispose();
      this.pickerOverlayRef = undefined;
      this.pickerInstanceRef = undefined;

      if (this._clickedOutsideListener) {
        this._clickedOutsideListener();
        this._clickedOutsideListener = null;
      }

      this.changeDetector.markForCheck();
      this._detachSub.unsubscribe();
    });

    this.pickerInstanceRef.instance.control = {
      timeValue: this.timeValue,
      onChange: (value: Date) => {
        this.setValue(value);
      }
    }

    this._clickedOutsideListener = this.renderer.listen('document', 'click', ($event: MouseEvent) => {
      if (this.pickerOpened) {
        let el: HTMLElement = <HTMLElement>$event.target;
        let isThisEl = false;
        while (el.parentElement && !isThisEl) {
          isThisEl = this.element.nativeElement === el || this.pickerInstanceRef.location.nativeElement === el;
          el = el.parentElement;
        }
        if (!isThisEl) {
          this.hidePicker();
        }
      }
    });

    this.changeDetector.markForCheck();
  }

  removeClick(event: any): void {
    event.stopPropagation();
    this.input.nativeElement.value = null;
    this.setValue(null);
  }

  private setValue(value: any): void {
    if (value) {
      if (this.stringMode && typeof value === 'string') {
        const input = value.split(':');
        const date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        if (input.length > 0) {
          date.setHours(Number(input[0]));
        }
        if (input.length > 1) {
          date.setMinutes(Number(input[1]));
        }
        if (input.length > 2) {
          date.setSeconds(Number(input[2]));
        }
        value = date;
      }

      const val = moment(value, TIME_FORMAT);
      this.viewValue = val.format(TIME_FORMAT);
      this.timeValue = value;

      this.changed.emit(this.stringMode ? moment(value).format(TIME_FORMAT) : value);
    }
    else {
      this.viewValue = '';
      this.timeValue = null;

      this.changed.emit(null);
    }

    this.changeDetector.markForCheck();
  }
}
