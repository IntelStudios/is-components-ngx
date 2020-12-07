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
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import * as m from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';

import { DATEPICKER_CONFIG_DEFAULT, IsDatepickerPopupComponent } from '../is-datepicker-popup/is-datepicker-popup.component';
import { configToken, IsDatepickerConfig } from '../is-datepicker.interfaces';

const moment = m;

export const DATE_FORMAT = 'DD-MM-YYYY';

export const NG_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsDatepickerComponent),
  multi: true
};

export const NG_DATEPICKER_VALUE_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => IsDatepickerComponent),
  multi: true
}

@Component({
  selector: 'is-datepicker',
  templateUrl: './is-datepicker.component.html',
  styleUrls: ['./is-datepicker.component.scss'],
  providers: [NG_DATEPICKER_VALUE_ACCESSOR, NG_DATEPICKER_VALUE_VALIDATOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsDatepickerComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input('allowClear')
  allowClear: boolean = false;

  @Input('placeholder')
  placeholder: string = '';

  @Input()
  hidden = false;

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
   * when localDateMode enabled, picker will understand date as local, without time
   */
  @Input()
  localDateMode = false;

  /**
   * display date format (angular date pipe)
   */
  @Input()
  viewFormat: string = 'dd-MM-yyyy';

  @Input()
  alignment: 'left' | 'center' | 'right' = 'left';

  @Output()
  changed: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('input', { static: true })
  input: ElementRef;

  dateValue: any = '';

  disabled: boolean = false;

  @Input() readonly: boolean = false;

  dateControl: FormControl;

  private pickerOverlayRef: OverlayRef;
  private pickerInstanceRef: ComponentRef<IsDatepickerPopupComponent>;
  private _clickedOutsideListener = null;
  private _changeSubscription: Subscription = null;
  private onTouched: Function;
  private _detachSub: Subscription;
  private validatorOnChangeFn: Function = null;

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Optional() @Inject(configToken) private dpConfig: IsDatepickerConfig,
    private overlay: Overlay,
    private el: ElementRef, private renderer: Renderer2) {
    if (this.dpConfig) {
      if (this.dpConfig.viewFormat) {
        this.viewFormat = this.dpConfig.viewFormat;
      }
      if (this.dpConfig.localDateMode !== undefined) {
        this.localDateMode = this.dpConfig.localDateMode;
      }
    }

    this.dateControl = new FormControl();
  }

  ngOnInit(): void {
    // validator below is solved with ngx-mask
    // const dateValidator = (control: AbstractControl) => {
    //   const invalid = { 'dateInvalid': true };
    //   const value = control.value;

    //   if (value && typeof value === 'string') {
    //     const match = value.match(/^((0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-[12]\d{3})$/);

    //     if (!match) {
    //       return invalid;
    //     }
    //   }

    //   return null;
    // };

    // this.dateControl.setValidators(dateValidator);

    // after ngx-mask initialization
    setTimeout(() => this.changeDetector.markForCheck());
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

  onInputValueChange($event: string): void {
    if (this.dateControl.invalid || !$event) {
      // if date is invalid or empty, result value will be null
      this.changed.emit(null);

      if (!$event) {
        this.dateValue = null;
        this.input.nativeElement.value = null;
      }

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
    if (this.stringMode) {
      this.changed.emit(moment(this.dateValue).format(DATE_FORMAT));
    } else {
      if (this.localDateMode) {
        const date = new Date(this.dateValue);
        date.setHours(0, 0, 0, 0);
        this.changed.emit(this.stripTimezone(date));
      } else {
        this.changed.emit(this.dateValue);
      }
    }
    this.changeDetector.markForCheck();
  }

  onValueChange(): void {
    if (this.dateValue) {
      const valid = !isNaN(this.dateValue.valueOf());
      if (!valid) {
        // if date is invalid then set up actual date
        this.dateValue = this.stringMode ? this.stripTimezone(new Date()) : new Date();
      }
    }
    if (this.dateValue === null) {
      this.changed.emit(null);
      this.changeDetector.markForCheck();
      return;
    }
    if (this.stringMode) {
      this.changed.emit(moment(this.dateValue).format(DATE_FORMAT));
    } else {
      if (this.localDateMode) {
        const date = new Date(this.dateValue);
        date.setHours(0, 0, 0, 0);
        this.changed.emit(this.stripTimezone(date));
      } else {
        this.changed.emit(this.dateValue);
      }
    }
    this.changeDetector.markForCheck();
  }

  onRemove($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dateValue = null;
    this.input.nativeElement.value = null;
    this.dateControl.setErrors(null);
    this.onValueChange();
  }

  closePopup() {
    if (this.pickerInstanceRef) {
      this.pickerOverlayRef.detach();
    }
  }

  openPopup() {
    if (this.disabled || this.readonly) {
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
    this.changeDetector.markForCheck();
    if (!value) {
      this.dateValue = null;
      return;
    };
    const date = this.stringMode ? moment(value, DATE_FORMAT).local(true) : moment.utc(value);
    this.dateValue = this.localDateMode ? this.stripTimezone(date.toDate()) : date.toDate();
    console.log(this.localDateMode, this.dateValue);
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

  setReadonly(value: boolean) {
    this.readonly = value;
    this.changeDetector.markForCheck();
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

  /**
   * Implemented as part of NG Validator.
   */
  registerOnValidatorChange(fn: () => void): void {
    this.validatorOnChangeFn = fn;
  }

  /**
   * Implemented as part of NG Validator.
   */
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.valid && this.dateControl.valid) {
      return null;
    } else {
      return { 'dateInvalid': true };
    }
  }

  private stripTimezone(date: Date): Date {
    if (!date) {
      return null;
    }

    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset);
  }

}
