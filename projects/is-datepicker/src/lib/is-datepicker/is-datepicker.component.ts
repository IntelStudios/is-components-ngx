import { CdkScrollable, ConnectedPosition, Overlay, OverlayRef, ScrollDispatcher } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
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
import moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { IsCdkService, IsFieldErrorFactory } from '@intelstudios/cdk';
import { Subscription } from 'rxjs';

import { defaultDatePickerConfig, IsDatepickerPopupComponent } from '../is-datepicker-popup/is-datepicker-popup.component';
import { configToken, IsDatepickerConfig } from '../is-datepicker.interfaces';
import { distinctUntilChanged } from 'rxjs/operators';

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

export const defaultDatePickerRootConfig = (): IsDatepickerConfig => ({
  viewFormat: 'dd-MM-yyyy',
  localDateMode: false,
  mask: null,
});

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
  config: Partial<BsDatepickerConfig> = defaultDatePickerConfig();

  /**
   * Root config
   */
  rootConfig: IsDatepickerConfig = defaultDatePickerRootConfig();

  /**
   * when stringMode is enabled, expected and emitted date must be in Xeelo date format (DD-MM-YYYY)
   */
  @Input()
  stringMode: boolean = false;

  /**
   * when localDateMode enabled, picker will understand date as local, without time
   */
  @Input()
  localDateMode: boolean;

  @Input()
  mask: string;

  /**
   * display date format (angular date pipe)
   */
  @Input()
  viewFormat: string;

  @Input()
  alignment: 'left' | 'center' | 'right' = 'left';

  @Input()
  withTimepicker = false;

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
  private _scrollSub: Subscription;
  private _detachSub: Subscription;
  private validatorOnChangeFn: Function = null;

  constructor(
    @Optional() @Inject(configToken) private dpConfig: IsDatepickerConfig,
    private isCdk: IsCdkService,
    private scrollDispatcher: ScrollDispatcher,
    private changeDetector: ChangeDetectorRef,
    private overlay: Overlay,
    private datePipe: DatePipe,
    private el: ElementRef, private renderer: Renderer2) {
    this.rootConfig = { ...this.rootConfig, ...dpConfig };
    // Properties didnt get their input values, yet
    this.viewFormat = this.rootConfig.viewFormat;
    this.localDateMode = this.rootConfig.localDateMode;
    this.mask = this.rootConfig.mask;

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
    this.closePopup();
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
    if (this._detachSub) {
      this._detachSub.unsubscribe();
    }
    if (this._scrollSub) {
      this._scrollSub.unsubscribe();
    }
  }

  get isOpen(): boolean {
    return !!this.pickerOverlayRef;
  }

  onInputValueChange($event: KeyboardEvent): void {
    const { value, readOnly } = $event.target as HTMLInputElement;
    // UP/DOWN arrows to incr/decr date
    if (!readOnly && this.dateValue) {
      if ($event.key === 'ArrowUp') {
        this.dateValue = moment(this.dateValue).add(1, 'day').toDate();
        this.onValueChange();
        return;
      }
      if ($event.key === 'ArrowDown') {
        this.dateValue = moment(this.dateValue).add(-1, 'day').toDate();
        this.onValueChange();
        return;
      }
    }

    if (this.dateControl.invalid || !this.dateControl.value) {
      // if date is invalid or empty, result value will be null
      this.changed.emit(null);

      if (!this.dateControl.value) {
        this.dateValue = null;
        this.dateControl.setErrors(null);
        this.input.nativeElement.value = null;
      }

      this.changeDetector.markForCheck();
      return;
    }

    const date = moment(value, DATE_FORMAT).toDate();
    const valid = !isNaN(date.valueOf());
    if (!valid) {
      this.dateControl.setErrors(IsFieldErrorFactory.dateInvalidError());
      this.dateValue = null;
      this.changed.emit(null);
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

  onInputClick(): void {
    const hasMask = this.mask;

    if (hasMask || this.isOpen) {
      this.closePopup();
      return;
    }

    this.openPopup();
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

    const ancScrolls: CdkScrollable[] = this.scrollDispatcher.getAncestorScrollContainers(this.el);
    if (ancScrolls.length > 0) {
      this.pickerOverlayRef = this.isCdk.create(
        {
          minWidth: `${optionsWidth}px`,
          minHeight: `${optionsHeight}px`,
          positionStrategy: positionStrategy
        },
        this.el
      );

      this._scrollSub = this.scrollDispatcher.scrolled().pipe(distinctUntilChanged()).subscribe((ev: CdkScrollable) => {
        if (ev) {
          if (ancScrolls.filter(x=>x.getElementRef() === ev.getElementRef()).length > 0) {
            this.closePopup();
          }
        }
        else {
          this.closePopup();
        }

        this.changeDetector.detectChanges();
      })
    } else {
      this.pickerOverlayRef = this.isCdk.create(
        {
          minWidth: `${optionsWidth}px`,
          minHeight: `${optionsHeight}px`,
          positionStrategy: positionStrategy,
          scrollStrategy: this.overlay.scrollStrategies.close()
        },
        this.el
      );
    }

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

      if (this._scrollSub) {
        this._scrollSub.unsubscribe();
      }

      this.changeDetector.markForCheck();
      this._detachSub.unsubscribe();
    });
    this.pickerInstanceRef.instance.value = this.dateValue;
    this.pickerInstanceRef.instance.config = this.config;
    this.pickerInstanceRef.instance.withTimepicker = this.withTimepicker;
    this.pickerInstanceRef.instance.control = {
      onChange: (value: Date) => {
        this.dateValue = value;
        this.dateControl.setErrors(null);
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
    // unless this is set, we wont get initial value displayed
    this.dateControl.patchValue(this.datePipe.transform(this.dateValue, this.viewFormat));
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
      return IsFieldErrorFactory.dateInvalidError();
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
