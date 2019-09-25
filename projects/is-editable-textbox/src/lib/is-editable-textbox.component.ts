import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl } from '@angular/forms';

const IS_EDITABLE_TEXTBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsEditableTextboxComponent),
  multi: true
};

const IS_EDITABLE_TEXTBOX_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => IsEditableTextboxComponent),
  multi: true
}

@Component({
  selector: 'is-editable-textbox',
  templateUrl: 'is-editable-textbox.component.html',
  styleUrls: ['is-editable-textbox.component.scss'],
  providers: [IS_EDITABLE_TEXTBOX_VALUE_ACCESSOR, IS_EDITABLE_TEXTBOX_VALIDATORS],
})
export class IsEditableTextboxComponent implements OnInit, ControlValueAccessor {
  @Input()
  autocomplete: any;

  @Input()
  placeholder = '';

  @Input()
  set edit(value: boolean) {
    this._edit = value;
  }
  get edit(): boolean {
    return this._edit;
  }

  @Input()
  validator: any = { valid: false };

  @Output()
  changed: EventEmitter<boolean> = new EventEmitter<boolean>();

  public value = '';

  disabled: boolean;

  // the method set in registerOnChange to emit changes back to the form
  private _onChangeCallback = (_: any) => { };
  private _onTouchedCallback = (_: any) => { };

  private _edit: boolean = false;

  // validation change function
  onValidatorChangeFn: Function = null;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  toggleEdit() {
    this.edit = !this.edit;
    this.changed.emit(this.edit);
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

  // Begin Validators methods
  validate(c: AbstractControl) {
    return c.valid ? null : this.validator;
  }

  registerOnValidatorChange(fn: any) {
    this.onValidatorChangeFn = fn;
  }
}
