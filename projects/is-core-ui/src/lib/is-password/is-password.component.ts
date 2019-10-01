import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export const IS_PASSWORD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsPasswordComponent),
  multi: true
};

@Component({
  selector: 'is-password',
  templateUrl: 'is-password.component.html',
  styleUrls: ['is-password.component.scss'],
  providers: [IS_PASSWORD_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsPasswordComponent {

  @Input()
  autocomplete: any;

  @Input()
  placeholder: string = '';

  @Output()
  changed: EventEmitter<any> = new EventEmitter<any>();

  value: string = '';

  disabled: boolean;

  // the method set in registerOnChange to emit changes back to the form
  private _onChangeCallback = (_: any) => { };
  onTouched = () => { };

  constructor(private changeDetector: ChangeDetectorRef) {

  }

  // change events from the input
  onChange(event: any) {
    if (event) {
      this._onChangeCallback(event.target.value);
    }
  }

  togglePassword(input: any) {
    input.type === 'text' ? input.type = 'password' : input.type = 'text';
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: string): void {
    if (!value) {
      return;
    }

    this.value = value;
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

  /**`
   * Implemented as part of ControlValueAccessor.
   */
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
}
