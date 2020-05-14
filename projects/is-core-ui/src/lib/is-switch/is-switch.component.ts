import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IsSwitchChange } from './is-switch.interfaces';

export const IS_CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsSwitchComponent),
  multi: true
};


let switchId = 0;

@Component({
  selector: 'is-switch',
  templateUrl: './is-switch.component.html',
  styleUrls: ['is-switch.component.scss'],
  providers: [IS_CHECKBOX_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsSwitchComponent implements ControlValueAccessor {

  @Input()
  switchId = `is-switch-${switchId++}`;

  @Input()
  checked = false;

  @Input()
  value;

  @Input()
  disabled = false;

  @Output()
  change = new EventEmitter<IsSwitchChange>();

  @ViewChild('inputEl') private _inputEl: ElementRef;

  private _onChangeCallback = (_: any) => { };
  onTouched = () => { };

  constructor(
    @Attribute('name') public _name: string,
    private changeDetector: ChangeDetectorRef
  ) {
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
    this._onChangeCallback(checked);
    this.change.emit({ value, checked, event });
  }
}

