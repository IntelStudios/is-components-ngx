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
  private _minLoadChars = 0;

  public values: SelectPickerItem[] = [];
  public valueText: string = '';

  searchControl: FormControl;
  isLoadingOptions = false;
  disabled: boolean;
  filteredOptions: SelectPickerItem[];

  activeItem: SelectPickerItem = null;

  @Input()
  set options(opts: SelectPickerItem[]) {
    if (!this.canSetOptions() || !opts) {
      return;
    }
    if (opts) {
      opts = opts.map((o: SelectPickerItem) => Object.assign({}, o))
    }
    this.isSearch = (opts && opts.length > 5) || (this._minLoadChars > 0);
    this._options = opts;
    this.filterOptions(this.searchControl.value || '');
    if (opts && this.values.length > 0) {
      opts.forEach((o: SelectPickerItem) => {
        o.Object = this.values.findIndex(i => i.ID === o.ID) > -1;
      });
      this.updateValueText();
      this.setActiveItem();
    }
    this.isLoadingOptions = false;
    this.changeDetector.detectChanges();
  }

  @Input()
  placeholder: string = '';

  @Input()
  searchPlaceholder: string = '';

  @Input()
  set minLoadChars(val: number) {
    this.isSearch = val > 0;
    this._minLoadChars = val;
  }

  get options(): SelectPickerItem[] {
    return this._options;
  }

  @Output()
  changed: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  loadOptions: EventEmitter<string> = new EventEmitter<string>();

  isSearch: boolean = false;

  constructor(private _eref: ElementRef, private changeDetector: ChangeDetectorRef) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.searchControl.setValue('');
    this._searchControlSubscription = this.searchControl.valueChanges.pipe(
      debounceTime(50))
      .subscribe((newValue: string) => {
        if (this._minLoadChars > 0) {

          if (newValue.length >= this._minLoadChars && !this.isLoadingOptions && (!this.options || !this.options.length)) {
            this.isLoadingOptions = true;
            this.loadOptions.emit(newValue);
          } else if (newValue.length < this._minLoadChars) {
            // clear options, because we need to load them again once user types minSearchChars
            this._options = null;
            if (this.isLoadingOptions) {
              // emit loadOptions event with null value - client should cancel option load
              this.loadOptions.emit(null);
            }
            this.isLoadingOptions = false;
            // console.log('unset options');
          }
        }
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
    if ((!this.filteredOptions) || (this.filteredOptions.length === 0)) {
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
      this.values = (<any[]>value).map((i: any) => {
        if (i.ID && i.Value) {
          return i;
        } else {
          return {ID: i, Value: i, Object: null};
        }
      })
      if (this.options) {
        this.options.forEach((o: SelectPickerItem) => {
          o.Object = this.values.findIndex(i => i.ID === o.ID) > -1;
        });
      }
    } else {
      this.values = [];
    }

    this.updateValueText();

    this.changeDetector.detectChanges();
  }

  optionToggle($event: SelectPickerItem) {
    const val = this.values.find(o => o.ID === $event.ID);
    if (val === undefined) {
      this.values.push($event);
      $event.Object = true;
    } else {
      this.values.splice(this.values.indexOf(val), 1);
      $event.Object = false;
    }
    this.updateValueText();
    this.changed.next(this.values.map(v => v.ID));
  }

  onOptionsShown() {
    const input = this._eref.nativeElement.querySelector('input[type="search"]');
    this.activeItem = null;
    this.changeDetector.markForCheck();
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

  private canSetOptions() {
    return this._minLoadChars === 0 || (this.isLoadingOptions && this._minLoadChars > 0);
  }

  private updateValueText() {
    if (this.values) {
      this.valueText = this.values.map((o: SelectPickerItem) => o.Value).join(', ');
    } else {
      this.valueText = '';
    }

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
    if (!this.options || newValue.length < this._minLoadChars) {
      this.filteredOptions = [];
    } else {
      this.filteredOptions = this._options.filter(item => {
        return item.Value.toUpperCase().indexOf(newValue.toUpperCase()) !== -1;
      });
    }
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
