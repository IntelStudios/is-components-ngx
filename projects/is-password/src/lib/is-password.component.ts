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
import { Subscription } from 'rxjs';

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

  @Input()
  title: string;

  @Output()
  changed: EventEmitter<any> = new EventEmitter<any>();

  public value: string = '';

  disabled: boolean;

  private _changeSubscription: Subscription = null;
  private onTouched: Function;

  constructor(private changeDetector: ChangeDetectorRef) {

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
}
