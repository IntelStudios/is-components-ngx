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
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import * as m from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';

import { DATEPICKER_CONFIG_DEFAULT, IsDatepickerPopupComponent } from '../is-datepicker-popup/is-datepicker-popup.component';

const moment = m;

export const DATE_FORMAT = 'DD-MM-YYYY';

export const NG_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsDatepickerComponent),
  multi: true
};

@Component({
  selector: 'is-datepicker',
  templateUrl: './is-datepicker.component.html',
  styleUrls: ['./is-datepicker.component.scss'],
  providers: [NG_DATEPICKER_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsDatepickerComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input('allowClear')
  allowClear: boolean = false;

  @Input('placeholder')
  placeholder: string = '';

  /**
 * BsDatepicker config object to setup wrapped BsDatepickerInline component
 */
  @Input()
  config: Partial<BsDatepickerConfig> = DATEPICKER_CONFIG_DEFAULT;
  /**
   * when stringMode is enabled, expected and emitted date must be in Xeelo date format (DD-MM-YYYY)
   */
  @Input()
  stringMode: boolean = false;

  /**
   * display date format (angular date pipe)
   */
  @Input()
  viewFormat: string = 'dd-MM-yyyy';

  @Input()
  alignment: 'left' | 'center' | 'right' = 'left';

  /**
   * ammends selected date to be End Of Day
   */
  @Input('isEOD') isEOD: boolean = false;

  /**
   * ammends selected date to be Start Of Day
   */
  @Input('isSOD') isSOD: boolean = false;

  @Output()
  changed: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('input', { static: true })
  input: ElementRef;

  dateValue: any = '';
  disabled: boolean = false;

  dateControl: FormControl;

  private pickerOverlayRef: OverlayRef;
  private pickerInstanceRef: ComponentRef<IsDatepickerPopupComponent>;
  private _clickedOutsideListener = null;
  private _changeSubscription: Subscription = null;
  private onTouched: Function;
  private _detachSub: Subscription;

  constructor(private changeDetector: ChangeDetectorRef, private overlay: Overlay, private el: ElementRef, private renderer: Renderer2) {
    this.dateControl = new FormControl();
  }

  ngOnInit(): void {
    const dateValidator = (control: AbstractControl) => {
      const invalid = { 'dateInvalid': true };
      const value = control.value;

      if (value && typeof value === 'string') {
        const match = value.match(/^((0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-[12]\d{3})$/);

        if (!match) {
          return invalid;
        }
      }

      return null;
    };

    this.dateControl.setValidators([dateValidator, Validators.pattern(new RegExp('^[0-9-]*$'))]);
  }

  ngOnDestroy() {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
    if (this._detachSub) {
      this._detachSub.unsubscribe();
    }
  }

  get isOpen(): boolean {
    return !!this.pickerOverlayRef;
  }

  // checkKey(e: KeyboardEvent): void {
  //   console.log('evet ', e.keyCode);


  //   if (
  //     (e.keyCode >= 48 && e.keyCode <= 57) ||  // digits
  //     (e.keyCode >= 96 && e.keyCode <= 105) || // digits on numeric keyboard
  //     e.key === 'Backspace' ||
  //     e.key === 'Delete' ||
  //     e.key === 'Enter' ||
  //     e.keyCode === 109 ||                  // dash on numeric
  //     e.keyCode === 189 ||                  // dash
  //     (e.keyCode >= 35 && e.keyCode <= 40)  // home, end, arrows
  //   ) {
  //     // still missing check for ctrl/cmd + A, ctrl/cmd + c, ctrl/cmd + v etc.
  //   } else {
  //     e.preventDefault();
  //     return;
  //   }
  // }

  onInputValueChange($event: string,): void {
    if (this.dateControl.invalid) {
      // if date is invalid, result value will be null
      this.changed.emit(null);
      this.changeDetector.markForCheck();
      return;
    }

    const date = moment($event, DATE_FORMAT).toDate();
    const valid = !isNaN(date.valueOf());
    if (!valid) {
      this.dateControl.setErrors({ 'dateInvalid': true });
      return;
    }
    this.dateValue = date;

    if (this.dateValue === null) {
      this.changed.emit(null);
      this.changeDetector.markForCheck();
      return;
    }

    this.changed.emit(this.stringMode ? moment(this.dateValue).format(DATE_FORMAT) : this.dateValue);
    this.changeDetector.markForCheck();
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
    const date = this.stripTimezone(this.dateValue);
    // console.log(date.toISOString());
    this.changed.emit(this.stringMode ? moment(this.dateValue).format(DATE_FORMAT) : this.dateValue);
    this.changeDetector.markForCheck();
  }

  onRemove($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dateValue = null;
    this.input.nativeElement.value = null;
    this.onValueChange();
  }

  closePopup() {
    if (this.pickerInstanceRef) {
      this.pickerOverlayRef.detach();
    }
  }

  openPopup() {
    if (this.disabled) {
      return;
    }

    if (this.isOpen) {
      this.closePopup();
      return;
    }

    const rect: DOMRect = this.el.nativeElement.getBoundingClientRect();
    const optionsHeight = 286;
    const optionsWidth = 280;
    const isDropup = rect.bottom + optionsHeight > window.innerHeight;
    const dropUpClass = isDropup ? ' is-datepicker-popup-dropup' : '';

    const position: ConnectedPosition = isDropup ?
      { originY: 'top', originX: 'end', overlayX: 'end', overlayY: 'bottom' }
      : { originY: 'bottom', originX: 'end', overlayX: 'end', overlayY: 'top' };

    const wouldOverflowLeft = optionsWidth - rect.width > rect.left;
    if (wouldOverflowLeft) {
      position.originX = 'start';
      position.overlayX = 'start';
    }

    const positionStrategy = this.overlay.position().flexibleConnectedTo(this.el)
      .withPositions([position])
      .withPush(true);

    this.pickerOverlayRef = this.overlay.create(
      {
        minWidth: `${optionsWidth}px`,
        minHeight: `${optionsHeight}px`,
        positionStrategy: positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close()
      }
    );
    this.pickerInstanceRef = this.pickerOverlayRef.attach(new ComponentPortal(IsDatepickerPopupComponent));
    const classes = this.el.nativeElement.className.replace(/ng-[\w-]+/g, ' ').trim() + dropUpClass;
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
    this.pickerInstanceRef.instance.value = this.dateValue;
    this.pickerInstanceRef.instance.config = this.config;
    this.pickerInstanceRef.instance.control = {
      onChange: (value: Date) => {
        this.dateValue = value;
        this.closePopup();
        this.onValueChange();
      }
    }

    this._clickedOutsideListener = this.renderer.listen('document', 'click', ($event: MouseEvent) => {
      if (this.isOpen) {
        let el: HTMLElement = <HTMLElement>$event.target;
        let isThisEl = false;
        while (el.parentElement && !isThisEl) {
          isThisEl = this.el.nativeElement === el || this.pickerInstanceRef.location.nativeElement === el;
          el = el.parentElement;
        }
        if (!isThisEl) {
          this.closePopup();
        }
      }
    });

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

