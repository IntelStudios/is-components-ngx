import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ChildrenBehavior, GenericBehavior, OptionsBehavior } from './behavior';
import { IsSelectOptionDirective, IsSelectOptionSelectedDirective } from './is-select.directives';
import { SelectItem } from './select-item';
import { escapeRegexp, stripTags } from './select-pipes';
import { IsSelectModelConfig } from './is-select.interfaces';

export const IS_SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsSelectComponent),
  multi: true
};

@Component({
  selector: 'is-select',
  templateUrl: './is-select.component.html',
  styleUrls: ['./is-select.component.scss'],
  providers: [IS_SELECT_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsSelectComponent implements OnInit, ControlValueAccessor {

  @Input() allowClear: boolean = false;
  @Input() placeholder: string = 'None';
  @Input() searchPlaceholder: string = 'Type to search';
  @Input() isSearch: boolean = true;

  /**
   * when modelConfig is set, component will require model in writeValue
   * and will emit similar model on change.
   */
  @Input()
  modelConfig: IsSelectModelConfig = null;

  /**
   * unset current value in case there is no matching option when options are set
   */
  @Input()
  unsetNoMatch: boolean = false;

  @Input()
  set items(value: Array<any>) {
    if (!value) {
      this._items = this.options = [];
    } else {
      this._items = value.filter((item: any) => {
        if ((typeof item === 'string') || (typeof item === 'object' && (item.ID || item.ID === 0) && item.Value)) {
          return item;
        }
      });
      this.options = this._items.map((item: any) => new SelectItem(item));
      if (this._value) {
        const prev = this._active;
        const active = this.options.find(o => o.ID === this._value);
        if (active) {
          this._active = active;
        }
        if (!active && prev && this.unsetNoMatch) {
          this._active = active;
          // there was a value, but given options did not contain it
          this.emitChange() // emit change
        }
      }
    }

    // neccessary check if you are using select with groups
    if (this.firstItemHasChildren) {
      if (this.options.findIndex((item: SelectItem) => item.children === null || item.children === undefined) > -1) {
        // it is required that every parent must have own child/ren
        console.warn('Every item of the array must have children, filtering items without children...');
        this.options = this.options.filter((item: SelectItem) => item.children);
      }
      this.behavior = new ChildrenBehavior(this);
    } else {
      this.behavior = new GenericBehavior(this);
    }

    if (value && this.isLoadingOptions && this.inputValue && this.inputValue.length >= this._minLoadChars) {
      const filterValue = escapeRegexp(this.inputValue).trim();
      const parts: string[] = filterValue.split(' ').map((p: string) => p ? `(${p}).*` : '');
      this.behavior.filter(new RegExp(parts.join(''), 'ig'));
      this.isLoadingOptions = false;
    }
    this.changeDetector.markForCheck();
  }

  @Input()
  set minLoadChars(val: number) {
    this.isSearch = val > 0;
    this._minLoadChars = val;
  }

  @Input()
  set disabled(value: boolean) {
    this.setDisabledState(value);
  }
  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  set selection(val: any) {
    this.writeValue(val);
  }

  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() removed: EventEmitter<any> = new EventEmitter();
  @Output() typed: EventEmitter<string> = new EventEmitter<string>();
  @Output() opened: EventEmitter<any> = new EventEmitter();
  @Output() changed: EventEmitter<any> = new EventEmitter();
  @Output() loadOptions: EventEmitter<string> = new EventEmitter<string>();

  options: Array<SelectItem> = [];
  inputValue: string = '';
  activeOption: SelectItem;
  isLoadingOptions = false;

  get active(): SelectItem {
    return this._active;
  }

  set optionsOpened(value: boolean) {
    this._optionsOpened = value;
    this.opened.emit(value);
  }

  get optionsOpened(): boolean {
    return this._optionsOpened;
  }

  public get firstItemHasChildren(): boolean {
    return this.options[0] && this.options[0].hasChildren();
  }

  @ContentChild(IsSelectOptionDirective, { read: TemplateRef })
  templateOption: IsSelectOptionDirective;

  @ContentChild(IsSelectOptionSelectedDirective, { read: TemplateRef })
  templateOptionSelected: IsSelectOptionSelectedDirective;

  private inputMode: boolean = false;
  private _optionsOpened: boolean = false;
  private behavior: OptionsBehavior;
  private _items: Array<any> = [];
  private _disabled: boolean = false;
  private _active: SelectItem = null;
  private _clickedOutsideListener = null;
  private onTouched: Function;
  private _changeSubscription: Subscription = null;
  private _value: string;
  private _minLoadChars = 0;

  constructor(public element: ElementRef, private renderer: Renderer2, private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {

  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: any): void {
    console.log('ww', value);
    if (value === null || value === undefined) {
      this._active = null;
      this._value = null;
    } else {
      if (this.modelConfig) {
        this._value = String(value[this.modelConfig.idProp]);
      } else {
        this._value = String(value);
      }

      if (this.options && this.options.length > 0) {
        const prev = this._active;
        let active = null;
        if (this.behavior instanceof ChildrenBehavior) {
          this.options.forEach((item: SelectItem) => {
            const activeChildren = item.children.find(c => c.ID === this._value);
            if (activeChildren) {
              active = activeChildren;
            }
          });
        } else {
          active = this.options.find(o => o.ID === this._value);
        }

        if (active) {
          this._active = active;
        }

        if (!active && prev && this.unsetNoMatch) {
          // there was a value, but given options did not contain it
          this._active = active;
          this.emitChange(); // emit change
        } else if (!active && this.modelConfig) {
          // value was set, we have options, but none matches and we have modelConfig
          // still set active item to look like the option is set
          this._active = new SelectItem(value, this.modelConfig);
        }

      } else {
        // no options, but if we have modelConfig we must look like the option is set
        if (this.modelConfig) {
          this._active = new SelectItem(value, this.modelConfig);
        }
      }
    }
    this.changeDetector.markForCheck();
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
    this._disabled = isDisabled;
    if (this._disabled === true) {
      this.hideOptions();
    }
    this.changeDetector.detectChanges();
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }

  sanitize(html: string): any {
    // disable sanitizing as it breaks
    // selection event handlers in firefox
    return html;
  }

  inputEvent(e: any, isUpMode: boolean = false): void {
    // tab
    if (e.keyCode === 9) {
      return;
    }
    if (isUpMode && (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 ||
      e.keyCode === 40 || e.keyCode === 13)) {
      e.preventDefault();
      return;
    }
    // backspace
    if (!isUpMode && e.keyCode === 8) {
      const el: any = this.element.nativeElement
        .querySelector('div.ui-select-search > input');
      if (!el.value || el.value.length <= 0) {
        if (this.active) {
          this.remove();
        }
        e.preventDefault();
      }
    }
    // esc
    if (!isUpMode && e.keyCode === 27) {
      this.hideOptions();
      this.element.nativeElement.children[0].focus();
      e.preventDefault();
      return;
    }
    // del
    if (!isUpMode && e.keyCode === 46 && !this.optionsOpened) {
      if (this.active) {
        this.remove();
      }
      e.preventDefault();
    }
    // left
    if (!isUpMode && e.keyCode === 37 && this._items.length > 0) {
      this.behavior.first();
      e.preventDefault();
      return;
    }
    // right
    if (!isUpMode && e.keyCode === 39 && this._items.length > 0) {
      this.behavior.last();
      e.preventDefault();
      return;
    }
    // up
    if (!isUpMode && e.keyCode === 38) {
      this.behavior.prev();
      e.preventDefault();
      return;
    }
    // down
    if (!isUpMode && e.keyCode === 40) {
      this.behavior.next();
      e.preventDefault();
      return;
    }
    // enter
    if (!isUpMode && e.keyCode === 13) {
      this.selectActiveMatch();
      this.behavior.next();
      e.preventDefault();
      return;
    }
  }

  onSearchChange($event: any) {
    this.inputValue = $event;
    if (this._minLoadChars > 0) {
      if (this.inputValue.length >= this._minLoadChars && !this.isLoadingOptions && (!this._items || !this._items.length)) {
        this.isLoadingOptions = true;
        this.loadOptions.emit(this.inputValue);
      } else if (this.inputValue.length < this._minLoadChars) {
        // clear options, because we need to load them again once user types minSearchChars
        this.items = null;
        if (this.isLoadingOptions) {
          // emit loadOptions event with null value - client should cancel option load
          this.loadOptions.emit(null);
        }
        this.isLoadingOptions = false;
        // console.log('unset options');
      }
    }
    const filterValue = escapeRegexp(this.inputValue).trim();
    const parts: string[] = filterValue.split(' ').map((p: string) => p ? `(${p}).*` : '');
    this.behavior.filter(new RegExp(parts.join(''), 'ig'));
    this.typed.emit(this.inputValue);
  }

  remove(): void {
    if (this._disabled === true) {
      return;
    }
    const current = this._active;
    if (current) {
      this._active = null;
      this.changed.emit(null);
      this.removed.emit(current);
      this.changeDetector.markForCheck();
    }
  }

  matchClick(e: MouseEvent): void {
    if (this._disabled === true) {
      return;
    }

    if (this.inputMode === true) {
      this.hideOptions();
      return;
    }
    this.inputMode = !this.inputMode;
    if (this.inputMode === true) {
      this.focusToInput();
      this.open();
    }
  }

  mainClick(event: any): void {
    if (this.inputMode === true || this._disabled === true) {
      return;
    }
    if (event.keyCode === 46) {
      event.preventDefault();
      this.inputEvent(event);
      return;
    }
    if (event.keyCode === 8) {
      event.preventDefault();
      this.inputEvent(event, true);
      return;
    }
    if (event.keyCode === 9 || event.keyCode === 13 ||
      event.keyCode === 27 || (event.keyCode >= 37 && event.keyCode <= 40)) {
      event.preventDefault();
      return;
    }
    this.inputMode = true;
    const value = String
      .fromCharCode(96 <= event.keyCode && event.keyCode <= 105 ? event.keyCode - 48 : event.keyCode)
      .toLowerCase();
    this.focusToInput(value);
    this.open();
    const target = event.target || event.srcElement;
    target.value = value;
    this.inputEvent(event);
  }

  selectActive(value: SelectItem): void {
    this.activeOption = value;
    this.changeDetector.markForCheck();
  }

  scrollToSelected(): void {
    const selectedElement = this.element.nativeElement.querySelector('div.ui-select-choices-row.selected');
    if (selectedElement === null) {
      return;
    }
    this.element.nativeElement.querySelector('ul.ui-select-choices').scrollTop = selectedElement.offsetTop - 40;
  }

  isActive(value: SelectItem): boolean {
    if(!this.activeOption) {
      return;
    }
    return this.activeOption.ID === value.ID;
  }

  removeClick(event: any): void {
    event.stopPropagation();
    this.remove();
  }

  focusToInput(value: string = ''): void {
    setTimeout(() => {
      const el = this.element.nativeElement.querySelector('div.ui-select-search > input');
      if (el) {
        el.focus();
        el.value = value;
      }
    }, 0);
  }

  hideOptions(): void {
    this.inputMode = false;
    this.optionsOpened = false;
    if (this._clickedOutsideListener) {
      this._clickedOutsideListener();
      this._clickedOutsideListener = null;
    }
    if (this._minLoadChars > 0) {
      this.items = null; // clear lazy loaded items
    }
    this.changeDetector.markForCheck();
  }

  selectMatch(value: SelectItem, e: Event = void 0): void {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.options.length <= 0) {
      return;
    }
    this._active = value;
    this.emitChange();
    this.selected.emit(value);
    this.hideOptions();
    this.focusToInput(stripTags(value.Value));
    this.element.nativeElement.querySelector('.ui-select-container').focus();
  }

  private emitChange() {
    if (this.modelConfig) {
      if (this.active) {
        const obj: any = {};
        obj[this.modelConfig.idProp] = this.active.ID;
        obj[this.modelConfig.textProp] = this.active.Value;
        this.changed.emit(obj);
      } else {
        this.changed.emit(null);
      }

    } else {
      this.changed.emit(this.active ? this.active.ID : null);
    }

  }

  private open(): void {

    if (this.options.length > 0 && (!this.active || !this.activeOption)) {
      this.behavior.first();
    }
    this.optionsOpened = true;
    this._clickedOutsideListener = this.renderer.listen('document', 'click', this.clickedOutside.bind(this));
    this.changeDetector.markForCheck();
  }

  private clickedOutside($event: MouseEvent): void {
    if (this.optionsOpened) {
      let element: HTMLElement = <HTMLElement>$event.target;
      let isThisEl = false;
      while (element.parentElement && !isThisEl) {
        isThisEl = this.element.nativeElement === element;
        element = element.parentElement;
      }
      if (!isThisEl) {
        this.hideOptions();
      }
    }
  }

  private selectActiveMatch(): void {
    this.selectMatch(this.activeOption);
  }

  ngOnDestroy() {

  }
}
