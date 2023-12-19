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

export const IS_INPUT_SECRET_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsInputSecretComponent),
  multi: true
};

@Component({
  selector: 'is-input-secret',
  templateUrl: 'is-input-secret.component.html',
  styleUrls: ['is-input-secret.component.scss'],
  providers: [IS_INPUT_SECRET_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsInputSecretComponent {

  @Input()
  placeholder: string = '';

  @Output()
  changed: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  value: string = '';

  maskedValue: string = '';

  showPassword = false;

  @Input()
  disabled: boolean;

  // the method set in registerOnChange to emit changes back to the form
  private _onChangeCallback = (_: any) => { };
  onTouched = () => { };

  constructor(private cd: ChangeDetectorRef) {

  }

  // change events from the input
  onChange(event: any) {
    if (event) {
      this._onChangeCallback(event.target.value);
    }
    this.value = event.target.value;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.cd.markForCheck();
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: string): void {
    if (!value) {
      value = '';
    }
    this.value = value;
    this.cd.markForCheck();
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
    this.cd.markForCheck();
  }

  /**`
   * Implemented as part of ControlValueAccessor.
   */
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
}
