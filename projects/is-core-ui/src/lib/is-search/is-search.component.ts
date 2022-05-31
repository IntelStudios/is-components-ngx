import {
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
  placeholder = 'Search keyword';

  @Output()
  change: EventEmitter<string> = new EventEmitter();

  @ViewChild('inputEl', { static: true })
  input: ElementRef<HTMLInputElement>;

  public value: string = '';

  // the method set in registerOnChange to emit changes back to the form
  private _onChangeCallback = (_: any) => { };
  private _onTouchedCallback = (_: any) => { };

  constructor(public el: ElementRef, private cd: ChangeDetectorRef) {

  }

  focus(): void {
    if (this.input) {
      this.input.nativeElement.focus();
    }
  }

  // change events from the input
  onChange(event: any) {
    if (event) {
      this.value = event.target.value;
      this.emitChange();
    }
  }

  clear(): void {
    this.writeValue('');
    this.emitChange();
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: string): void {
    this.value = value;
    this.input.nativeElement.value = value;
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
  registerOnTouched(fn: (_: any) => {}): void {
    this._onTouchedCallback = fn;
  }

  private emitChange() {
    this.change.next(this.value);
    this._onChangeCallback(this.value);
  }
}
