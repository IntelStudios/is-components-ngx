import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'is-editable-textbox',
  templateUrl: 'is-editable-textbox.component.html',
  styleUrls: ['is-editable-textbox.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IsEditableTextboxComponent),
    multi: true,
  }],
})
export class IsEditableTextboxComponent implements OnInit, ControlValueAccessor {
  @Input()
  autocomplete: any;

  @Input()
  placeholder = '';

  @Input()
  edit = false;

  @Output()
  changed: EventEmitter<any> = new EventEmitter<any>();

  public value = '';

  disabled: boolean;

  // the method set in registerOnChange to emit changes back to the form
  private _onChangeCallback = (_: any) => { };
  private _onTouchedCallback = (_: any) => { };

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  toggleEdit() {
    this.edit = !this.edit;
    this.changeDetector.markForCheck();
  }

  // change events from the input
  onChange(event: any) {
    if (event) {
      this._onChangeCallback(event.target.value);
      this.value = event.target.value;
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: string): void {
    this.value = value;
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
  registerOnTouched(fn: (_: any) => {}): void {
    this._onTouchedCallback = fn;
  }
}
