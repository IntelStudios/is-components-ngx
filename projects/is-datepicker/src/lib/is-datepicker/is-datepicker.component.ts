import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as m from 'moment';
import { BsDatepickerDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';

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
  encapsulation: ViewEncapsulation.None
})
export class IsDatepickerComponent implements OnDestroy, ControlValueAccessor {

  @Input('allowClear')
  allowClear: boolean = false;

  @Input('placeholder')
  placeholder: string = '';

  @Input('iconHidden')
  iconHidden: boolean = false;

  @Input('initOnLoad')
  initOnLoad: boolean = true;

  /**
   * when stringMode is enabled, expected and emitted date must be in Xeelo date format (DD-MM-YYYY)
   */
  @Input()
  stringMode: boolean = false;

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

  @ViewChild('dp')
  datepicker: BsDatepickerDirective;

  dateFormat: string = DATE_FORMAT;

  datepickerModel: any = '';
  disabled: boolean = false;

  private _changeSubscription: Subscription = null;
  private onTouched: Function;

  constructor(private changeDetector: ChangeDetectorRef, private el: ElementRef, private renderer: Renderer2) {

  }

  onChange() {
    if (this.datepickerModel) {
      let valid = !isNaN(this.datepickerModel.valueOf());
      if (!valid) {
        // if date is invalid then set up actual date
        this.datepickerModel = this.stripTimezone(new Date());
      }
    }
    if (this.datepickerModel === null) {
      this.changed.emit(null);
      this.changeDetector.markForCheck();
      return;
    }
    const date = this.stripTimezone(this.datepickerModel);
    // console.log(date.toISOString());
    this.changed.emit(this.stringMode ?  moment(date).format(DATE_FORMAT) : date);
    this.changeDetector.markForCheck();
  }

  onShown($event: any) {
    this.adjustPosition();
    if (!this.datepickerModel && this.initOnLoad) {
      this.datepickerModel = new Date();

      setTimeout(() => {
        this.datepicker.show();
      })

      this.changed.emit(this.stringMode ? moment(this.datepickerModel).format(DATE_FORMAT) : this.datepickerModel);
      this.changeDetector.markForCheck();
    }
  }

  onRemove($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.datepickerModel = null;
    this.onChange();
  }

  openDatepicker() {
    if (!this.disabled && !this.isOpen) {
      setTimeout(() => {
        this.datepicker.show();
      })
    }
  }

  get isOpen(): boolean {
    return this.datepicker && this.datepicker.isOpen;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: string): void {
    if (!value) {
      this.datepickerModel = null;
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
      this.datepickerModel = date.toDate();
    }
    else {
      this.datepickerModel = null;
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

  /**
   * nasty workaround to datepicker positioning
   */
  private adjustPosition() {
    // this code is highly based on experiments, calculations does not have anything common with math or geometry
    // as a side effect there is (either on left or righ) a space, which does not work as close trigger on outside click

    const input = this.el.nativeElement.querySelector('input');
    const dp = document.querySelector('bs-datepicker-container > .bs-datepicker');
    //const igb = this.el.nativeElement.querySelector('.input-group-btn');
    const inputDim: DOMRect = input.getBoundingClientRect();
    const dpDim: DOMRect = dp.getBoundingClientRect() as DOMRect;
    //const igbDim: DOMRect = igb.getBoundingClientRect();
    const elDim: DOMRect = this.el.nativeElement.getBoundingClientRect();
    const wouldOverflowLeft = dpDim.width - inputDim.width > inputDim.left;
    this.renderer.setStyle(dp, 'position', 'absolute');
    this.renderer.setStyle(dp, 'top', '2px');
    if (wouldOverflowLeft) {
      this.renderer.setStyle(dp, 'left', `0px`);
    } else {
      this.renderer.setStyle(dp, 'right', `-${26 + (inputDim.width / 2)}px`);
    }
  }

  ngOnDestroy() {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
  }
}

