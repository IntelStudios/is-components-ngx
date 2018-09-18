import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Renderer2,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SelectItem } from './select-item';
import { stripTags, escapeRegexp } from './select-pipes';
import { OptionsBehavior } from './select-interfaces';
import { IsSelectOptionDirective } from './is-select.directives';
import { ChildrenBehavior, GenericBehavior } from './behavior';

@Component({
  selector: 'is-select',
  templateUrl: './is-select.component.html',
  styleUrls: ['./is-select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsSelectComponent implements OnInit {

  @Input() allowClear: boolean = false;
  @Input() placeholder: string = '';
  @Input() idField: string = 'id';
  @Input() textField: string = 'text';
  @Input() multiple: boolean = false;
  @Input() isSearch: boolean = true;

  @Input()
  set items(value: Array<any>) {
    if (!value) {
      this._items = this.itemObjects = [];
    } else {
      this._items = value.filter((item: any) => {
        // if ((typeof item === 'string' && item) || (typeof item === 'object' && item && item.text && item.id)) {
        if ((typeof item === 'string') || (typeof item === 'object' && item.text)) {
          return item;
        }
      });
      // this.itemObjects = this._items.map((item:any) => (typeof item === 'string' ? new SelectItem(item) : new SelectItem({id: item[this.idField], text: item[this.textField]})));
      this.itemObjects = this._items.map((item: any) => new SelectItem(item));
    }
  }

  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
    if (this._disabled === true) {
      this.hideOptions();
    }
  }

  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  set active(selectedItems: Array<any>) {
    if (!selectedItems || selectedItems.length === 0) {
      this._active = [];
    } else {
      let areItemsStrings = typeof selectedItems[0] === 'string';

      this._active = selectedItems.map((item: any) => {
        let data = areItemsStrings
          ? item
          : { id: item[this.idField], text: item[this.textField] };

        return new SelectItem(data);
      });
    }
  }

  @Output() data: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() removed: EventEmitter<any> = new EventEmitter();
  @Output() typed: EventEmitter<any> = new EventEmitter();
  @Output() opened: EventEmitter<any> = new EventEmitter();

  options: Array<SelectItem> = [];
  itemObjects: Array<SelectItem> = [];
  activeOption: SelectItem;

  get active(): Array<any> {
    return this._active;
  }

  set optionsOpened(value: boolean) {
    this._optionsOpened = value;
    this.opened.emit(value);
  }

  get optionsOpened(): boolean {
    return this._optionsOpened;
  }

  @ContentChild(IsSelectOptionDirective, {read: TemplateRef})
  templateOption: IsSelectOptionDirective;

  private inputMode: boolean = false;
  private _optionsOpened: boolean = false;
  private behavior: OptionsBehavior;
  inputValue: string = '';
  private _items: Array<any> = [];
  private _disabled: boolean = false;
  private _active: Array<SelectItem> = [];
  private _clickedOutsideListener = null;

  constructor(public element: ElementRef, private renderer: Renderer2, private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef) {

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
      let el: any = this.element.nativeElement
        .querySelector('div.ui-select-search > input');
      if (!el.value || el.value.length <= 0) {
        if (this.active.length > 0) {
          this.remove(this.active[this.active.length - 1]);
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
      if (this.active.length > 0) {
        this.remove(this.active[this.active.length - 1]);
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
      if (this.active.indexOf(this.activeOption) === -1) {
        this.selectActiveMatch();
        this.behavior.next();
      }
      e.preventDefault();
      return;
    }
  }

  onSearchChange($event: any) {
    this.inputValue = $event;
    const filterValue = escapeRegexp(this.inputValue).trim();
    const parts: string[] = filterValue.split(' ').map((p: string) => p ? `(${p}).*` : '');
    this.behavior.filter(new RegExp(parts.join(''), 'ig'));
    this.doEvent('typed', this.inputValue);
  }

  ngOnInit(): any {
    this.behavior = (this.firstItemHasChildren) ?
      new ChildrenBehavior(this) : new GenericBehavior(this);
  }

  ngOnDestroy() {

  }

  remove(item: SelectItem): void {
    if (this._disabled === true) {
      return;
    }
    if (this.multiple === true && this.active) {
      let index = this.active.indexOf(item);
      this.active.splice(index, 1);
      this.data.next(this.active);
      this.doEvent('removed', item);
    }
    if (this.multiple === false) {
      this.active = [];
      this.data.next(this.active);
      this.doEvent('removed', item);
    }
  }

  private doEvent(type: string, value: any): void {
    if ((this as any)[type] && value) {
      (this as any)[type].next(value);
    }
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

  public get firstItemHasChildren(): boolean {
    return this.itemObjects[0] && this.itemObjects[0].hasChildren();
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
    if (this.inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
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
    let value = String
      .fromCharCode(96 <= event.keyCode && event.keyCode <= 105 ? event.keyCode - 48 : event.keyCode)
      .toLowerCase();
    this.focusToInput(value);
    this.open();
    let target = event.target || event.srcElement;
    target.value = value;
    this.inputEvent(event);
  }

  selectActive(value: SelectItem): void {
    this.activeOption = value;
  }

  scrollToSelected(): void {
    let selectedElement = this.element.nativeElement.querySelector('div.ui-select-choices-row.selected');
    if (selectedElement === null) {
      return;
    }
    this.element.nativeElement.querySelector('ul.ui-select-choices').scrollTop = selectedElement.offsetTop - 40;
  }

  isActive(value: SelectItem): boolean {
    return this.activeOption.text === value.text;
  }

  removeClick(value: SelectItem, event: any): void {
    event.stopPropagation();
    this.remove(value);
  }

  focusToInput(value: string = ''): void {
    setTimeout(() => {
      let el = this.element.nativeElement.querySelector('div.ui-select-search > input');
      if (el) {
        el.focus();
        el.value = value;
      }
    }, 0);
  }

  private open(): void {
    this.options = this.itemObjects
      .filter((option: SelectItem) => (this.multiple === false ||
        this.multiple === true && !this.active.find((o: SelectItem) => option.text === o.text)));

    if (this.options.length > 0) {
      this.behavior.first();
    }
    this.optionsOpened = true;
    this._clickedOutsideListener = this.renderer.listen('document', 'click', this.clickedOutside.bind(this));
    this.changeDetector.markForCheck();
  }

  private hideOptions(): void {
    this.inputMode = false;
    this.optionsOpened = false;
    if (this._clickedOutsideListener) {
      this._clickedOutsideListener();
      this._clickedOutsideListener = null;
    }
    this.changeDetector.markForCheck();
  }

  private selectActiveMatch(): void {
    this.selectMatch(this.activeOption);
  }

  selectMatch(value: SelectItem, e: Event = void 0): void {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.options.length <= 0) {
      return;
    }
    if (this.multiple === true) {
      this.active.push(value);
      this.data.next(this.active);
    }
    if (this.multiple === false) {
      this.active[0] = value;
      this.data.next(this.active[0]);
    }
    this.doEvent('selected', value);
    this.hideOptions();
    if (this.multiple === true) {
      this.focusToInput('');
    } else {
      this.focusToInput(stripTags(value.text));
      this.element.nativeElement.querySelector('.ui-select-container').focus();
    }
  }

}
