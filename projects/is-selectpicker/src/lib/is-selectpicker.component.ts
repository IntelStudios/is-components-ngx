import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SelectPickerItem } from './is-selectpicker.interfaces';

export const IS_SELECTPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsSelectpickerComponent),
  multi: true
};

@Component({
  selector: 'is-selectpicker',
  templateUrl: './is-selectpicker.component.html',
  styleUrls: ['./is-selectpicker.component.scss'],
  providers: [IS_SELECTPICKER_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class IsSelectpickerComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @ViewChild('rolesDropdown') rolesDropdown: BsDropdownDirective;

  private _options: SelectPickerItem[] = [];
  private _changeSubscription: Subscription = null;
  private _searchControlSubscription: Subscription = null;
  private onTouched: Function;

  public values: any[] = [];
  public valueText: string = '';

  searchControl: FormControl;
  disabled: boolean;
  filteredOptions: SelectPickerItem[];

  activeItem: SelectPickerItem = null;

  @Input()
  set options(opts: SelectPickerItem[]) {
    if (opts) {
      opts = opts.map((o: SelectPickerItem) => Object.assign({}, o));
    }
    this.isSearch = opts && opts.length > 5;
    this._options = opts;
    this.filteredOptions = opts;
    if (opts && this.values.length > 0) {
      opts.forEach((o: SelectPickerItem) => {
        o.Object = this.values.indexOf(o.ID) > -1;
      });
      this.updateValueText();
      this.setActiveItem();
    }
  }

  @Input()
  placeholder: string = '';

  get options(): SelectPickerItem[] {
    return this._options;
  }

  @Output()
  changed: EventEmitter<any> = new EventEmitter<any>();


  isSearch: boolean = false;

  constructor(private _eref: ElementRef, private changeDetector: ChangeDetectorRef) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.searchControl.setValue('');
    this._searchControlSubscription = this.searchControl.valueChanges.pipe(
      debounceTime(100))
      .subscribe((newValue: string) => {
        this.filterOptions(newValue);
      });
  }

  ngOnDestroy() {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
    if (this._searchControlSubscription) {
      this._searchControlSubscription.unsubscribe();
    }
  }

  onKeyDown($event: KeyboardEvent) {
    // console.log($event);
    if (this.filteredOptions.length === 0) {
      return;
    }
    if ($event.keyCode === 40) { // key down
      const i = this.filteredOptions.indexOf(this.activeItem) + 1;
      if (this.filteredOptions.length > i) {
        this.activeItem = this.filteredOptions[i];
        this.ensureActiveItemVisible();
        this.changeDetector.detectChanges();
      } else {
        this.activeItem = this.filteredOptions[0];
        this.ensureActiveItemVisible()
        this.changeDetector.detectChanges();
      }
      $event.preventDefault();
      return;
    }
    if ($event.keyCode === 38) { // key up
      const i = this.filteredOptions.indexOf(this.activeItem) - 1;
      if (i > -1) {
        this.activeItem = this.filteredOptions[i];
        this.ensureActiveItemVisible()
        this.changeDetector.detectChanges();
      } else {
        this.activeItem = this.filteredOptions[this.filteredOptions.length - 1];
        this.ensureActiveItemVisible()
        this.changeDetector.detectChanges();
      }
      $event.preventDefault();
      return;
    }

    if ($event.keyCode === 36) { // home
      this.activeItem = this.filteredOptions[0];
      this.ensureActiveItemVisible()
      this.changeDetector.detectChanges();
      $event.preventDefault();
      return;
    }


    if ($event.keyCode === 35) { // end
      this.activeItem = this.filteredOptions[this.filteredOptions.length - 1];
      this.ensureActiveItemVisible()
      this.changeDetector.detectChanges();
      $event.preventDefault();
      return;
    }



    if ($event.keyCode === 13) { // Enter => toggle selection
      this.optionToggle(this.activeItem);
      $event.preventDefault();
      $event.stopPropagation();
      return;
    }
    if ($event.keyCode === 27) { // Escape => Close dropdown
      this.rolesDropdown.toggle();
      $event.preventDefault();
      this.changeDetector.detectChanges();
      return;
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: any): void {
    if (value instanceof Array) {
      this.values = <number[]>value;
      this.options.forEach((o: SelectPickerItem) => {
        o.Object = this.values.indexOf(o.ID) > -1;
      });
    } else {
      this.values = [];
    }
    this.changeDetector.detectChanges();
  }

  optionToggle($event: SelectPickerItem) {
    const val = this.values.find((o: any) => o === $event.ID);
    if (!val) {
      this.values.push($event.ID);
      $event.Object = true;
    } else {
      this.values.splice(this.values.indexOf(val), 1);
      $event.Object = false;
    }
    this.updateValueText();
    this.changed.next(this.values);
  }

  onOptionsShown() {
    const input = this._eref.nativeElement.querySelector('input[type="search"]');
    if (input) {
      setTimeout(() => input.focus());
    }
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
    this.changeDetector.detectChanges();
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }

  private updateValueText() {
    const selected: string[] = this.options
      .filter((o: SelectPickerItem) => o.Object == true)
      .map((o: SelectPickerItem) => o.Value);
    this.valueText = selected.join(', ');
    this.changeDetector.detectChanges();
  }

  private setActiveItem() {
    if (this.filteredOptions.length > 0) {
      this.activeItem = this.filteredOptions[0];
    } else {
      this.activeItem = null;
    }
    this.changeDetector.detectChanges();
  }

  private filterOptions(newValue: string) {
    this.filteredOptions = this._options.filter(item => {
      return item.Value.toUpperCase().indexOf(newValue.toUpperCase()) !== -1
    });
    this.setActiveItem();
    this.changeDetector.detectChanges();
  }

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.rolesDropdown.isOpen = false;
      this.changeDetector.detectChanges();
    }
  }

  private ensureActiveItemVisible() {
    setTimeout(() => {
      const container = this._eref.nativeElement.querySelector('ul.dropdown-default');
      const active = container.querySelector('li.active');
      if (active.offsetTop > container.offsetHeight) {
        container.scrollTop = active.offsetTop - container.offsetHeight;
      } else if (active.offsetTop < container.scrollTop) {
        container.scrollTop = active.offsetTop - container.offsetHeight;
      }


    });

  }
}