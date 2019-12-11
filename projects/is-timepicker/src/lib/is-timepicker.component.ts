import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Renderer2,
  ComponentRef,
  ElementRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as m from 'moment';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsTimepickerComponent {

  @Input() allowClear: boolean = false;
  @Input('placeholder') placeholder: string = '';

  /**
   * when stringMode is enabled, expected and emitted date must be in Xeelo time format (HH:mm:ss)
   */
  @Input()
  stringMode: boolean = false;

  @Input()
  alignment: 'left' | 'center' | 'right' = 'left';

  get pickerOpened(): boolean {
    return !!this.pickerOverlayRef;
  }

  private pickerOverlayRef: OverlayRef;
  private pickerInstanceRef: ComponentRef<IsTimepickerPickerComponent>;

  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  public timeValue: Date;
  public viewValue: string = '';

  disabled: boolean;
  active: boolean;

  private onTouched: Function;
  private _changeSubscription: Subscription = null;
  private _clickedOutsideListener = null;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private overlay: Overlay,
    private changeDetector: ChangeDetectorRef)
  {
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
      this.pickerInstanceRef.destroy();
      this.pickerOverlayRef.detach();
      this.pickerOverlayRef.dispose();
      this.pickerOverlayRef = undefined;
      this.pickerInstanceRef = undefined;

      if (this._clickedOutsideListener) {
        this._clickedOutsideListener();
        this._clickedOutsideListener = null;
      }

      this.changeDetector.markForCheck();
    }
  }

  onPickerShown() {
    if (this.disabled) {
      return;
    }

    if (this.pickerOpened) {
      this.hidePicker();

      return;
    }

    const positions: any = [{ originX: 'end', originY: 'bottom',  overlayX: 'end', overlayY: 'top' }];

    const positionStrategy = this.overlay.position().flexibleConnectedTo(this.element)
      .withPositions(positions)
      .withPush(true);

    this.pickerOverlayRef = this.overlay.create(
      {
        minWidth: '180px',
        minHeight: '84px',
        positionStrategy: positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition()
      }
    );
    this.pickerInstanceRef = this.pickerOverlayRef.attach(new ComponentPortal(IsTimepickerPickerComponent));

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
      this.viewValue = '';
      this.timeValue = null;

      this.changed.emit(null);
    }

    this.changeDetector.markForCheck();
  }
}
