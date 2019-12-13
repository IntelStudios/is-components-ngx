import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
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
  ComponentRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { IsSelectOptionsComponent } from '../is-select-options/is-select-options.component';
import { IsSelectOptionDirective, IsSelectOptionSelectedDirective } from '../is-select.directives';
import { IsSelectModelConfig } from '../is-select.interfaces';
import { SelectItem } from '../select-item';

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
  @Input() placeholderShow: boolean = true;
  @Input() searchPlaceholder: string = 'Search a name or keyword';
  @Input() isSearch: boolean = true;
  @Input() alignItems: 'left' | 'right' = 'left';

  @Input()
  set multiple(value: boolean) {
    this._multiple = value;
    this.emitChange = value ? this.multipleEmitChange : this.singleEmitChange;
    this.writeValue = value ? this.multipleWriteValue : this.singleWriteValue;
  }
  get multiple(): boolean {
    return this._multiple;
  }

  @Input()
  showSelectAll: boolean = false;

  /**
   * When enabled (default) main input is resized based on
   * selected options. When disabled, main input keeps it's height
   * Applies only when [multiple]="true"
   */
  @Input()
  resize: boolean = true;

  /**
   * when set to positive value, search is auto enabled/disabled
   * based on miminum options. Should NOT be used together with
   * **minLoadChars** and **isSearch** as this setting sets **isSearch**
   * based on loaded items
   */
  @Input() autoSearchMinOptions: number = 0;

  /**
   * when modelConfig is set, component will require model in writeValue
   * and will emit similar model on change.
   */
  @Input()
  modelConfig: IsSelectModelConfig = null;

  /**
   * alternative to modelConfig. Enabling this
   * will set modelConfig compatible to `SelectItem`
   */
  @Input()
  set useModels(value: boolean) {
    if (value) {
      this.modelConfig = {
        idProp: 'ID',
        textProp: 'Value'
      };
    }
  }

  /**
   * unset current value in case there is no matching option when options are set
   */
  @Input()
  unsetNoMatch: boolean = false;

  @Input()
  set items(items: Array<any>) {
    if (!items) {
      this.options = [];
    } else {
      this.options = items.filter((item: any) => {
        if ((typeof item === 'string') || (typeof item === 'object' && (item.ID || item.ID === 0) && item.Value)) {
          return item;
        }
      }).map((item: any) => new SelectItem(item));

      if (this._value) {
        let active = null;
        if (!this.multiple) {
          // single value
          if (this.firstItemHasChildren) {
            this.options.forEach((item: SelectItem) => {
              const activeChild = item.children.find(c => c.ID === this._value);
              if (activeChild) {
                active = activeChild;
              }
            });
          } else {
            active = this.options.find(o => o.ID === this._value);
          }
          this._active = active;
          if (!active && this.unsetNoMatch) {
            this._active = null;
            // there was a value, but given options did not contain it
            this.emitChange() // emit change
          }
        }
        else {
          // multiple values
          if (this.firstItemHasChildren) {
            console.warn('setting value with [multiple]="true" and grouped options not yet implemented')
            // this.options.forEach((item: SelectItem) => {
            //   const activeChild = item.children.find(c => c.ID === this._value);
            //   if (activeChild) {
            //     active = activeChild;
            //   }
            // });
          } else {
            active = this.options.filter(o => this._value.indexOf(o.ID) > -1);
          }

          if (active) {
            this._active = active;
          }

          if (!active && this.unsetNoMatch) {
            console.warn('[unsetNoMatch]="true" does not (yet) work together with [multiple]="true"')
            // // there was a value, but given options did not contain it
            // this._active = active;
            // this.emitChange(); // emit change
          }
        }
      }
    }
    if (this.autoSearchMinOptions > 0) {
      this.isSearch = this.options.length >= this.autoSearchMinOptions;
    }

    if (this.optionsInstanceRef) {
      this.optionsInstanceRef.instance.setOptions(this.options);
    }
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

  @Input()
  alignment: 'left' | 'center' | 'right' = 'left';

  @Output() opened: EventEmitter<any> = new EventEmitter();
  @Output() changed: EventEmitter<any> = new EventEmitter();
  @Output() loadOptions: EventEmitter<string> = new EventEmitter<string>();

  options: Array<SelectItem> = [];

  /**
   * returns currenly active (selected) item
   */
  get active(): SelectItem | SelectItem[] {
    return this._active;
  }

  /**
   * returns currenly active (selected) item - use when set multiple=true
   */
  get multiActive(): SelectItem[] {
    return this._active as SelectItem[];
  }

  /**
 * returns currenly active (selected) item - use when set multiple=false
 */
  get singleActive(): SelectItem {
    return this._active as SelectItem;
  }

  get optionsOpened(): boolean {
    return !!this.optionsOverlayRef;
  }

  get optionsDropup(): boolean {
    return this.optionsOpened && this._optionsDropup;
  }

  private _optionsDropup: boolean = false;

  additionalValues: number = 0;

  @ContentChild(IsSelectOptionDirective, { read: TemplateRef, static: false })
  templateOption: IsSelectOptionDirective;

  @ContentChild(IsSelectOptionSelectedDirective, { read: TemplateRef, static: false })
  templateOptionSelected: IsSelectOptionSelectedDirective;

  private _multiple: boolean = false;
  private _disabled: boolean = false;
  private _active: SelectItem | SelectItem[] = null;
  private _clickedOutsideListener = null;
  private onTouched: Function;
  private _changeSubscription: Subscription = null;
  /**
   * internal value is used to store a value state in case we do not have options yet
   */
  private _value: string | string[];
  private _minLoadChars = 0;

  private optionsOverlayRef: OverlayRef;
  private optionsInstanceRef: ComponentRef<IsSelectOptionsComponent>;

  constructor(public element: ElementRef,
    private overlay: Overlay,
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef) {
    this.multiple = false;
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: any) {
    // this method's body is set by runtime to single/multiple prefixed version
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


  remove(): void {
    if (this._disabled === true) {
      return;
    }
    const current = this._active;
    if (current) {
      this._active = null;
      this._value = null;
      this.changed.emit(null);
      if (this.optionsInstanceRef) {
        this.optionsInstanceRef.instance.setValue(null);
      }
      this.changeDetector.markForCheck();
    }
  }

  matchClick(e: MouseEvent): void {
    if (this._disabled === true) {
      return;
    }

    if (this.optionsOpened) {
      this.hideOptions();
      return;
    }
    this.showOptions();
  }

  mainClick(event: any) {
    if (this.optionsOpened || this._disabled === true) {
      return;
    }
    if (event.keyCode === 46) {
      event.preventDefault();
      //this.inputEvent(event);
      return;
    }
    if (event.keyCode === 8) {
      event.preventDefault();
      //this.inputEvent(event, true);
      return;
    }
    if (event.keyCode === 9 || event.keyCode === 13 ||
      event.keyCode === 27 || (event.keyCode >= 37 && event.keyCode <= 40)) {
      event.preventDefault();
      return;
    }

    const value = String
      .fromCharCode(96 <= event.keyCode && event.keyCode <= 105 ? event.keyCode - 48 : event.keyCode)
      .toLowerCase();

    this.showOptions();
    const target = event.target || event.srcElement;
    target.value = value;
    //this.inputEvent(event);
  }


  removeClick(event: any) {
    event.stopPropagation();
    this.remove();
  }

  unselectClick(event: MouseEvent, item: SelectItem) {
    event.preventDefault();
    event.stopPropagation();
    this.unselect(item);
    if (this.optionsOpened) {
      this.optionsInstanceRef.instance.setValue(this.active);
      setTimeout(() => {
        this.updatePosition();
      });
    } else {
      this.updatePosition();
    }
  }

  private unselect(item: SelectItem) {
    if (this.multiple) {
      const active = this._active as SelectItem[];
      this._active = active.filter(i => i.ID !== item.ID);
    } else {
      this._active = null;
    }
    this.changeDetector.markForCheck();
    this.emitChange();
  }

  private get firstItemHasChildren(): boolean {
    return this.options[0] && this.options[0].hasChildren();
  }

  private emitChange() {
    // this method's body is set by runtime to single/multiple prefixed version
  }

  private singleEmitChange() {
    const active = this.active as SelectItem;
    if (this.modelConfig) {
      if (this.active) {
        const obj: any = this.modelConfig.baseModel ? { ...this.modelConfig.baseModel } : {};
        obj[this.modelConfig.idProp] = active.ID;
        obj[this.modelConfig.textProp] = active.Value;
        this.changed.emit(obj);
      } else {
        this.changed.emit(null);
      }

    } else {
      if (active) {
        // emit ID property from item's source in case it's number
        // otherwise Item's ID is always string
        if (active.source && !isNaN(parseInt(active.source.ID))) {
          this.changed.emit(Number(active.ID));
        } else {
          this.changed.emit(active.ID);
        }
      } else {
        this.changed.emit(null);
      }
    }
  }

  private multipleEmitChange() {
    const active = this.active as SelectItem[];
    if (this.modelConfig) {
      if (this.active) {
        const values = active.map((item: SelectItem) => {
          const obj: any = this.modelConfig.baseModel ? { ...this.modelConfig.baseModel } : {};
          obj[this.modelConfig.idProp] = item.ID;
          obj[this.modelConfig.textProp] = item.Value;
          return obj;
        });
        this.changed.emit(values);
      } else {
        this.changed.emit(null);
      }
    } else {
      if (active) {
        // emit ID property from item's source in case it's number
        // otherwise Item's ID is always string
        const values = active.map((item: SelectItem) => {
          if (item.source && !isNaN(parseInt(item.source.ID))) {
            return Number(item.ID);
          } else {
            return item.ID
          }
        });
        this.changed.emit(values);
      } else {
        this.changed.emit(null);
      }
    }
  }

  hideOptions() {
    if (this.optionsInstanceRef) {
      this.optionsInstanceRef.destroy();
      this.optionsOverlayRef.detach();
      this.optionsOverlayRef.dispose();
      this.optionsOverlayRef = undefined;
      this.optionsInstanceRef = undefined;
      if (this._clickedOutsideListener) {
        this._clickedOutsideListener();
        this._clickedOutsideListener = null;
      }

      if (this._minLoadChars > 0) {
        this.items = null; // clear lazy loaded items
      }
      this.changeDetector.markForCheck();
    }
  }

  showOptions() {

    const rect: DOMRect = this.element.nativeElement.getBoundingClientRect();
    const optionsHeight = this.isSearch ? 264 : 200;
    this._optionsDropup = rect.bottom + optionsHeight > window.innerHeight;
    const dropUpClass = this._optionsDropup ? ' is-select-options-dropup' : '';
    const position: ConnectedPosition = this._optionsDropup ?
      { originY: 'top', originX: 'start', overlayX: 'start', overlayY: 'bottom' }
      : { originY: 'bottom', originX: 'start', overlayX: 'start', overlayY: 'top' };
    const positionStrategy = this.overlay.position().flexibleConnectedTo(this.element)
      .withPositions([position])
      .withDefaultOffsetX(-1);

    this.optionsOverlayRef = this.overlay.create(
      {
        width: `${rect.width + 2}px`,
        minHeight: '34px',
        positionStrategy: positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition()
      }
    );
    this.optionsInstanceRef = this.optionsOverlayRef.attach(new ComponentPortal(IsSelectOptionsComponent));
    // copy/inherit classes from is-select and add them to is-select-options element, but ignore ng-*
    const classes = this.element.nativeElement.className.replace(/ng-[\w-]+/g, ' ').trim() + dropUpClass;
    this.renderer.setAttribute(this.optionsInstanceRef.location.nativeElement, 'class', classes);
    this.optionsInstanceRef.instance.control = {
      active: this.active,
      options: this.options,
      multiple: this.multiple,
      searchPlaceholder: this.searchPlaceholder,
      optionTemplate: this.templateOption,
      alignItems: this.alignItems,
      minLoadChars: this._minLoadChars,
      alignment: this.alignment,
      isSearch: this.isSearch,
      onClosed: () => {
        this.hideOptions();
      },
      onItemSelected: (item: SelectItem) => {
        if (this.multiple) {
          if (!this._active) {
            this._active = [];
          }
          (this._active as SelectItem[]).push(item);
        } else {
          this._active = item;
        }
        this.changeDetector.markForCheck();
        this.emitChange();

        setTimeout(() => {
          if (this.optionsOpened) {
            this.updatePosition();
            this.optionsInstanceRef.instance.setValue(this.active);
          }
        });
      },
      onItemUnselected: (item: SelectItem) => {
        this.unselect(item);
        setTimeout(() => {
          if (this.optionsOpened) {
            this.updatePosition();
            this.optionsInstanceRef.instance.setValue(this.active);
          }
        });
      },
      onLoadOptions: (filter: string) => {
        this.loadOptions.emit(filter);
      }
    }

    this._clickedOutsideListener = this.renderer.listen('document', 'click', ($event: MouseEvent) => {
      if (this.optionsOpened) {
        let el: HTMLElement = <HTMLElement>$event.target;
        let isThisEl = false;
        while (el.parentElement && !isThisEl) {
          isThisEl = this.element.nativeElement === el || this.optionsInstanceRef.location.nativeElement === el;
          el = el.parentElement;
        }
        if (!isThisEl) {
          this.hideOptions();
        }
      }
    });

    this.changeDetector.markForCheck();
  }

  private singleWriteValue(value: any): void {
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
        let active = null;
        if (this.firstItemHasChildren) {
          this.options.forEach((item: SelectItem) => {
            const activeChild = item.children.find(c => c.ID === this._value);
            if (activeChild) {
              active = activeChild;
            }
          });
        } else {
          active = this.options.find(o => o.ID === this._value);
        }

        if (active) {
          this._active = active;
        }

        if (!active && this.unsetNoMatch) {
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

  private multipleWriteValue(values: any[]): void {
    if (values === null || values === undefined || values === []) {
      this._active = null;
      this._value = null;
    } else {
      if (!values.map && this.modelConfig) {
        throw new Error('Value must be array of objects when in [multiple]="true" mode');
      }
      if (!values.map) {
        // assume string of comma-separated values
        values = String(values).split(',');
      }
      if (this.modelConfig) {
        this._value = values.map(v => String(v[this.modelConfig.idProp]));
      } else {
        this._value = values.map(v => String(v));
      }

      if (this.options && this.options.length > 0) {
        let active = null;
        if (this.firstItemHasChildren) {
          console.warn('setting value with [multiple]="true" and grouped options not yet implemented')
          // this.options.forEach((item: SelectItem) => {
          //   const activeChild = item.children.find(c => c.ID === this._value);
          //   if (activeChild) {
          //     active = activeChild;
          //   }
          // });
        } else {
          active = this.options.filter(o => this._value.indexOf(o.ID) > -1);
        }

        if (active) {
          this._active = active;
        }

        if (!active && this.unsetNoMatch) {
          console.warn('[unsetNoMatch]="true" does not (yet) work together with [multiple]="true"')
          // // there was a value, but given options did not contain it
          // this._active = active;
          // this.emitChange(); // emit change
        } else if (!active && this.modelConfig) {
          // value was set, we have options, but none matches and we have modelConfig
          // still set active item to look like the option is set
          this._active = values.map(v => new SelectItem(v, this.modelConfig));
        }

      } else {
        // no options, but if we have modelConfig we must look like the option is set
        if (this.modelConfig) {
          this._active = values.map(v => new SelectItem(v, this.modelConfig));
        }
      }
    }
    this.changeDetector.markForCheck();
    setTimeout(() => {
      this.updatePosition();
    })
  }

  private updatePosition() {
    if (this.optionsOpened) {
      this.optionsOverlayRef.updatePosition();
    }
    if (this.resize === false) {
      const elWrap = this.element.nativeElement.querySelector('.ui-select-match');
      const wrapRect = elWrap.getBoundingClientRect();
      const el = this.element.nativeElement.querySelector('.ui-select-toggle');
      const rect = el.getBoundingClientRect();
      if (rect.height <= wrapRect.height) {
        if (this.additionalValues !== 0) {
          this.additionalValues = 0;
          this.changeDetector.markForCheck();
          return;
        }
      }
      if (rect.height > wrapRect.height + 3) {
        // some options got hidden
        // force rendering hint for additional values
        this.additionalValues = 1;
        this.changeDetector.markForCheck();

        // calculate how many additioal options became hidden
        setTimeout(() => {
          const opts = el.querySelectorAll('.ui-select-match-text');
          const firstTop = opts[0].getBoundingClientRect().top;
          let i = 1;
          for (; i < opts.length; i++) {
            const oRect = opts[i].getBoundingClientRect();
            if (oRect.top > firstTop) {
              break;
            }
          }
          this.additionalValues = this.multiActive.length - i;
          this.changeDetector.markForCheck();
        });
      }
    }
  }
}
