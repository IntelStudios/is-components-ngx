import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { IsSelectComponent } from '../is-select/is-select.component';
import { SelectItem } from '../select-item';

export const IS_SELECT_BADGE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsSelectBadgeComponent),
  multi: true
};

export const BADGE_PATTERN: RegExp = new RegExp(/\[(\w+)_(.+?)\]/g);

@Component({
  selector: 'is-select-badge',
  templateUrl: './is-select-badge.component.html',
  providers: [IS_SELECT_BADGE_CONTROL_VALUE_ACCESSOR],
  styleUrls: ['./is-select-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsSelectBadgeComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

  @Input('readOnly')
  disabled: boolean;

  @Input()
  allowClear: boolean;

  @Input()
  multiple: boolean;

  @Input()
  useModels: boolean;

  @Input()
  placeholder: string = 'None';

  @Input()
  set value(value: any) {
    this._value = value;
    this.setValue();
  }
  get value(): any {
    return this._value;
  }

  @Input()
  set items(items: SelectItem[]) {
    if (!items || items.length === 0) {
      return;
    }
    this._items = this.parseItems(items);
    if (String(this._value)) {
      this.setValue();
    }
  }

  get items(): SelectItem[] {
    return this._items;
  }

  @Output()
  valueChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('select', { static: true })
  select: IsSelectComponent;

  private _items: SelectItem[] = [];

  private _value: any;

  private _changeSubscription: { unsubscribe: () => any } = null;
  /** Called when the combo is blurred. Needed to properly implement ControlValueAccessor. */
  onTouched: () => any = () => { return; };

  constructor(private changeDetector: ChangeDetectorRef, private sanitizer: DomSanitizer) {
    return;
  }

  ngOnDestroy() {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    return;
  }

  private parseItems(items: SelectItem[]): SelectItem[] {
    return items.map((it: SelectItem) => {
      const result = new RegExp(/\[(\w+)_(.+?)\]/g).exec(it.Value);
      if (result) {
        return new SelectItem({...it, cssClass: `is-badge is-badge-${result[1]}`, Value: result[2]});
      }
      return it;
    })
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: any) {
    this._value = value;
    setTimeout(() => this.setValue());
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnChange(fn: any) {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
    this._changeSubscription = <{ unsubscribe: () => any }>this.valueChange.subscribe(fn);
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetector.markForCheck();
  }

  valueSelected($event: any) {
    this._value = $event.ID;
    if ($event === []) {
      this.valueChange.next(null);
    } else {
      if (String(Number(this.value)) !== String(this.value) || this.value === ' ') {
        this.valueChange.next(this.value);
      } else {
        this.valueChange.next(Number(this.value));
      }
    }
    this.changeDetector.markForCheck();
  }

  removed() {
    if (this.select) {
      this._value = null;
      this.valueChange.next(this.value);
      setTimeout(() => this.select.hideOptions());
    }
  }

  private setValue() {
    if (this.select && this._items) {
      // need to type to string as select2 cannot work with 0
      if (String(this._value)) {
        const val = this._items.find((item: any) => String(item.ID) === String(this._value));
        //console.log(this.fieldId, this.value, val);
        if (val) {
          //console.log('selecting', this.fieldId, val);
          this.select.writeValue(this._value);
        } else {
          //console.log('value not found? ', this.fieldId, this.value);
          this.select.writeValue(null);
        }

      } else {
        //console.log('clearing', this.fieldId, this.value, this._items);
        this.select.writeValue(null);
      }

    } else {
      //console.log('nemam select nebo items');
      //this.select.active = [];
    }

    this.changeDetector.markForCheck();
  }
}
