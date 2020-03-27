import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const IS_EDITABLE_TEXTBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsEditableTextboxComponent),
  multi: true
};

@Component({
  selector: 'is-editable-textbox',
  templateUrl: 'is-editable-textbox.component.html',
  styleUrls: ['is-editable-textbox.component.scss'],
  providers: [IS_EDITABLE_TEXTBOX_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsEditableTextboxComponent implements OnInit, ControlValueAccessor {
  @Input()
  autocomplete: any;

  @Input()
  placeholder = '';

  @Input()
  edit = false;

  @Output()
  changed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('textInput')
  input: ElementRef;

  public value = '';

  disabled: boolean;

  // the method set in registerOnChange to emit changes back to the form
  private _onChangeCallback = (_: any) => { };
  private _onTouchedCallback = (_: any) => { };

  constructor(private changeDetector: ChangeDetectorRef, private elRef: ElementRef) { }

  ngOnInit() {
  }

  toggleEdit() {
    const el: HTMLElement = this.elRef.nativeElement;
    if (this.edit && el.classList.contains('ng-invalid')) {
      // do not let user escape from editing mode when the input is invalid
      return;
    }
    if (this.edit) {
      this.value = this.input.nativeElement.value;
    }
    this.edit = !this.edit;
    this.changed.emit(this.edit);
    this.changeDetector.markForCheck();
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
