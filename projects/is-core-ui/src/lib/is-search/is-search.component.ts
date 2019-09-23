import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export const IS_SEARCH_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsSearchComponent),
  multi: true
};

@Component({
  selector: 'is-search',
  templateUrl: 'is-search.component.html',
  styleUrls: ['is-search.component.scss'],
  providers: [IS_SEARCH_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsSearchComponent {
  @Input()
  placeholder: string = '';

  @Output()
  changed: EventEmitter<any> = new EventEmitter<any>();

  public value: string = '';

  // the method set in registerOnChange to emit changes back to the form
  private _onChangeCallback = (_: any) => { };
  private _onTouchedCallback = (_: any) => { };

  constructor() {

  }

  // change events from the input
  onChange(event: any) {
    if (event) {
      this._onChangeCallback(event.target.value);
    }
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
  registerOnTouched(fn: (_: any) => {}): void {
    this._onTouchedCallback = fn;
  }
}
