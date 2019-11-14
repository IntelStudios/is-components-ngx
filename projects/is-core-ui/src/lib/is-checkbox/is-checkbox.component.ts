import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Optional,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IsCheckboxChange } from './is-checkbox.interfaces';

let nextId = 1;

export const IS_RADIO_GROUP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsRadioGroupDirective),
  multi: true
};

@Directive({
  selector: 'is-radio-group',
  providers: [IS_RADIO_GROUP_VALUE_ACCESSOR]
})
export class IsRadioGroupDirective implements ControlValueAccessor {

  @ContentChildren(forwardRef(() => IsCheckboxComponent), { descendants: true })
  _radios: QueryList<IsCheckboxComponent>;

  disabled: boolean = false;

  private _onChangeCallback = (_: any) => { };
  onTouched = () => { };

  value: any;

  name = `is-radio-group-${nextId++}`;

  @Output() change = new EventEmitter<IsCheckboxChange>();

  constructor() { }

  /**
* Implemented as part of ControlValueAccessor.
*/
  writeValue(value: any): void {
    //this.checked = value === true;
    this.value = value;
    this._updateSelectedRadioFromValue();
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnChange(fn: (_: any) => {}): void {
    this._onChangeCallback = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this._radios) {
      this._radios.forEach(radio => {
        radio.setDisabledState(isDisabled);
      });
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  _emitChange(event: IsCheckboxChange) {
    this._onChangeCallback(event.value);
    this.change.emit(event);
  }

  /** Updates the `selected` radio button from the internal _value state. */
  private _updateSelectedRadioFromValue() {
    if (this._radios) {
      this._radios.forEach(radio => {
        radio.writeValue(this.value === radio.value);
      });
    }
  }
}


export const IS_CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsCheckboxComponent),
  multi: true
};


@Component({
  selector: 'is-checkbox,is-radio',
  templateUrl: './is-checkbox.component.html',
  styleUrls: ['is-checkbox.component.scss'],
  providers: [IS_CHECKBOX_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsCheckboxComponent implements ControlValueAccessor {


  @Input()
  checked = false;

  @Input() value;

  @Input()
  disabled = false;

  @Input()
  set indeterminate(value: boolean) {
    this._inputEl.nativeElement.indeterminate = value;
  }

  get indeterminate(): boolean {
    return this._inputEl.nativeElement.indeterminate;
  }

  @Output()
  change = new EventEmitter<IsCheckboxChange>();

  @ViewChild('inputEl', { static: true }) private _inputEl: ElementRef;

  type: 'checkbox' | 'radio';

  private _onChangeCallback = (_: any) => { };
  onTouched = () => { };

  constructor(
    @Optional() private radioGroup: IsRadioGroupDirective,
    @Attribute('name') public _name: string,
    private el: ElementRef,
    private changeDetector: ChangeDetectorRef
  ) {
    this.type = this.el.nativeElement.localName === 'is-checkbox' ? 'checkbox' : 'radio';
    if (!this._name && this.radioGroup) {
      this._name = this.radioGroup.name;
    }
  }

  /**
 * Implemented as part of ControlValueAccessor.
 */
  writeValue(value: any): void {
    this.checked = value === true || value === '1';
    this.changeDetector.markForCheck();
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnChange(fn: (_: any) => {}): void {
    this._onChangeCallback = fn;
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
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }


  _onChange(event: Event, checked: boolean, value: string) {
    // I stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    event.stopPropagation();
    // emit true/false in case of checkbox,
    // value in case of radio button
    this.checked = checked;
    this.type === 'checkbox' ? this._onChangeCallback(checked) : this._onChangeCallback(value);
    this.change.emit({ value, checked, event });
    if (this.radioGroup && checked) {
      this.radioGroup._emitChange({ value, checked, event });
    }
  }
}

