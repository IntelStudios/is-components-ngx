import { Overlay, OverlayRef, ConnectedPosition, OverlayConfig, ScrollDispatcher, CdkScrollable } from '@angular/cdk/overlay';
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
  Inject,
  Optional,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { IsSelectOptionsComponent } from '../is-select-options/is-select-options.component';
import { IsSelectOptionDirective, IsSelectOptionSelectedDirective } from '../is-select.directives';
import { IsSelectModelConfig, IsSelectMultipleConfig, configToken, IsSelectConfig, createDefaultConfig } from '../is-select.interfaces';
import { SelectItem } from '../select-item';
import { OptionsBehavior } from '../options-behavior';
import { IsCdkService } from '@intelstudios/cdk';
import { distinctUntilChanged } from 'rxjs/operators';

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
  @Input() allowHide: boolean = false;
  @Input() isSearch: boolean = true;
  @Input() alignItems: 'left' | 'right' = 'left';
  @Input() readonly: boolean = false;
  @Input() closeOptionsOnScroll: boolean = false;

  /**
   * When set, select will work in multi-select mode.
   */
  @Input()
  set multipleConfig(value: IsSelectMultipleConfig) {
    this._multipleConfig = value;
    this.emitChange = value ? this.multipleEmitChange : this.singleEmitChange;
    this.writeValue = value ? this.multipleWriteValue : this.singleWriteValue;
  }

  get multipleConfig(): IsSelectMultipleConfig {
    return this._multipleConfig;
  }

  get multiple(): boolean {
    return !!this._multipleConfig;
  }

  /**
   * state icon
   */
  @Input()
  icon: string;
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
   * Enable dropdown options to overflow control width
   */
  @Input() optionsOverflowWidth = false;

  /**
   * when modelConfig is set, component will require model in writeValue
   * and will emit similar model on change.
   */
  @Input()
  modelConfig: IsSelectModelConfig = null;

  /**
   * alternative to modelConfig. Enabling this
   * will set default modelConfig from IsSelectConfig (see IsSelectModule.forRoot)
   * By default compatible to `SelectItem`
   */
  @Input()
  set useModels(value: boolean) {
    if (value) {
      this.modelConfig = this.selectConfig.defaultModelConfig;
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
        if (SelectItem.isItem(item)) {
          return item;
        }
      }).map((item: any) => new SelectItem(item));

      if (this._value) {
        let active = null;
        if (!this.multiple) {
          // single value
          active = this.findSelectedOption(this.options);
          // we DID find currently set value among loaded options
          if (active) {
            this._active = active;
          }
          // we DID not find it and we're told to unset it
          if (!active && this.unsetNoMatch) {
            this._active = null;
            // there was a value, but given options did not contain it
            this.emitChange() // emit change
          }
        }
        else {
          // multiple values
          const current = this._active as SelectItem[];
          if (this.isGroupOptions) {
            const allAtomicOptions = OptionsBehavior.getLeafOptions(this.options)
            active = allAtomicOptions.filter(o => this._value.indexOf(o.ID) > -1);
          } else {
            if (this._active) {
              active = current.map((a) => {
                const opt = this.options.find((o) => o.ID === a.ID);
                if (opt) {
                  a.Value = opt.Value;
                }
                return a;
              });
            } else if (this.unsetNoMatch) {
              active = this.options.filter(o => this._value.indexOf(o.ID) > -1);
            }
          }
          if (active) {
            const origLen = current ? current.length : 0;
            this._active = active;
            if (origLen !== active.length) {
              this.emitChange();
            }
          }
          setTimeout(() => this.updatePosition());
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
  convertValueIDToInt = false;

  /**
   * Sets minimum search characters to trigger (loadOptions) event.
   * Set to 0, to emit event instantly when combo opens up (in such case filter will be set to empty string)
   */
  @Input()
  set minLoadChars(val: number) {
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
  /**
   * Event emitted when is-select needs you to load options (set [items] property).
   * Make sure items is alwyas fresh new array
   *
   */
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

  /**
   * Determines whether or not to hide the component
   */
  get hidden(): boolean {
    const isNotEditable = this.disabled || this.readonly;
    const noValueIsSet = this.active === null;
    const hiddenStateIsAllowed = this.allowHide;
    return isNotEditable && noValueIsSet && hiddenStateIsAllowed;
  }

  private _optionsDropup: boolean = false;

  additionalValues: number = 0;

  @ContentChild(IsSelectOptionDirective)
  templateOption: IsSelectOptionDirective;

  @ContentChild(IsSelectOptionSelectedDirective)
  templateOptionSelected: IsSelectOptionSelectedDirective;

  private _multipleConfig: IsSelectMultipleConfig;
  private _disabled: boolean = false;
  private _active: SelectItem | SelectItem[] = null;
  private _clickedOutsideListener = null;
  private onTouched: Function;
  private _changeSubscription: Subscription = null;
  private _scrollSub: Subscription;
  private _detachSub: Subscription;
  /**
   * internal value is used to store a value state in case we do not have options yet
   */
  private _value: string | string[];
  private _minLoadChars = -1;

  private optionsOverlayRef: OverlayRef;
  private optionsInstanceRef: ComponentRef<IsSelectOptionsComponent>;

  constructor(public element: ElementRef,
    private overlay: Overlay,
    private renderer: Renderer2,
    private isCdk: IsCdkService,
    private scrollDispatcher: ScrollDispatcher,
    @Optional() @Inject(configToken) private selectConfig: IsSelectConfig,
    private changeDetector: ChangeDetectorRef) {
    if (!this.selectConfig) {
      this.selectConfig = createDefaultConfig();
    }
    // trigger setter by default so we're initially in single select mode
    this.multipleConfig = undefined;
    if (this.selectConfig.optionsOverflowWidth !== undefined) {
      this.optionsOverflowWidth = this.selectConfig.optionsOverflowWidth;
    }
    if (this.selectConfig.allowClear !== undefined) {
      this.allowClear = this.selectConfig.allowClear;
    }
    if (this.selectConfig.closeOptionsOnScroll !== undefined) {
      this.closeOptionsOnScroll = this.selectConfig.closeOptionsOnScroll;
    }
    if (this.selectConfig.convertValueIDToInt !== undefined) {
      this.convertValueIDToInt = this.selectConfig.convertValueIDToInt;
    }
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this._scrollSub) {
      this._scrollSub.unsubscribe();
    }
  }

  setReadonly(value: boolean) {
    this.readonly = value;
    this.changeDetector.markForCheck();
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
    this.changeDetector.markForCheck();
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
    const isDisabledOrReadonly = this._disabled === true || this.readonly === true;
    if (isDisabledOrReadonly) {
      return;
    }

    if (this.optionsOpened) {
      this.hideOptions();
      return;
    }
    this.showOptions();
  }

  mainClick(event: any) {
    const isDisabledOrReadonly = this._disabled === true || this.readonly === true;
    if (this.optionsOpened || isDisabledOrReadonly) {
      return;
    }
    if (event.key === 'Tab') {
      return;
    }
    if (event.keyCode === 46) {
      event.preventDefault();
      return;
    }
    if (event.keyCode === 8) {
      event.preventDefault();
      return;
    }
    if (event.keyCode === 27 || (event.keyCode >= 37 && event.keyCode <= 40)) {
      event.preventDefault();
      return;
    }

    const value = String
      .fromCharCode(96 <= event.keyCode && event.keyCode <= 105 ? event.keyCode - 48 : event.keyCode)
      .toLowerCase().replace('\r', '');

    event.preventDefault();
    event.stopPropagation();
    this.showOptions(value);
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
      this._value = this._active.map(v => v.ID);
    } else {
      this._active = null;
      this._value = null;
    }
    this.changeDetector.markForCheck();
    this.emitChange();
  }

  private get isGroupOptions(): boolean {
    return this.options && this.options.findIndex(o => o.hasChildren()) > -1;
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
        if (this.modelConfig.objectProp) {
          obj[this.modelConfig.objectProp] = active.source;
        }
        this.changed.emit(obj);
      } else {
        this.changed.emit(null);
      }

    } else {
      if (active) {
        this.changed.emit(active.getID(this.convertValueIDToInt));
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
          if (this.modelConfig.objectProp) {
            obj[this.modelConfig.objectProp] = item.source;
          }
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
          return item.getID(this.convertValueIDToInt);
        });
        this.changed.emit(values);
      } else {
        this.changed.emit(null);
      }
    }
  }

  hideOptions() {
    if (this.optionsInstanceRef) {
      const el = this.element.nativeElement.querySelector('.ui-select-match');
      if (el) {
        el.focus();
      }
      this.optionsOverlayRef.detach();
    }
  }

  showOptions(searchValue?: string) {

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

    const overlayConfig: OverlayConfig = {
      minWidth: `${rect.width + 2}px`,
      minHeight: '34px',
      positionStrategy: positionStrategy
    };

    const oprionsOverflowClass = this.optionsOverflowWidth ? ' is-select-overflow-width' : '';
    if (!this.optionsOverflowWidth) {
      overlayConfig.width = overlayConfig.minWidth;
      overlayConfig.minWidth = undefined;
    }

    if (this.closeOptionsOnScroll) {
      const ancScrolls: CdkScrollable[] = this.scrollDispatcher.getAncestorScrollContainers(this.element);
      if (ancScrolls.length > 0) {
        this.optionsOverlayRef = this.isCdk.create(
          overlayConfig,
          this.element
        );

        this._scrollSub = this.scrollDispatcher.scrolled().pipe(distinctUntilChanged()).subscribe((ev: CdkScrollable) => {
          if (ev) {
            if (ancScrolls.filter(x => x.getElementRef() === ev.getElementRef()).length > 0) {
              this.hideOptions();
            }
          }
          else {
            this.hideOptions();
          }

          this.changeDetector.detectChanges();
        })
      } else {
        overlayConfig.scrollStrategy = this.overlay.scrollStrategies.close();

        this.optionsOverlayRef = this.isCdk.create(
          overlayConfig,
          this.element
        );
      }
    }
    else {
      overlayConfig.scrollStrategy = this.overlay.scrollStrategies.reposition();

      this.optionsOverlayRef = this.isCdk.create(
        overlayConfig,
        this.element
      );
    }

    // subscribe to detach event
    // overlay can be detached by us (calling hidOptions()) or by reposition strategy
    // we need to cleanup things
    this._detachSub = this.optionsOverlayRef.detachments().subscribe(() => {
      // console.log('overlay detached');
      this.optionsInstanceRef.destroy();
      this.optionsOverlayRef.dispose();
      this.optionsOverlayRef = undefined;
      this.optionsInstanceRef = undefined;
      if (this._clickedOutsideListener) {
        this._clickedOutsideListener();
        this._clickedOutsideListener = null;
      }

      if (this._minLoadChars > -1) {
        this.items = null; // clear lazy loaded items
      }

      if (this._scrollSub) {
        this._scrollSub.unsubscribe();
      }

      this.changeDetector.markForCheck();
      this._detachSub.unsubscribe();
    });

    this.optionsInstanceRef = this.optionsOverlayRef.attach(new ComponentPortal(IsSelectOptionsComponent));
    // copy/inherit classes from is-select and add them to is-select-options element, but ignore ng-*
    const classes = this.element.nativeElement.className.replace(/ng-[\w-]+/g, ' ').replace(/[ ]+/g, ' ').trim() + dropUpClass + oprionsOverflowClass;
    this.renderer.setAttribute(this.optionsInstanceRef.location.nativeElement, 'class', classes);
    this.optionsInstanceRef.instance.control = {
      active: this.active,
      options: this.options,
      isGroupOptions: this.isGroupOptions,
      multipleConfig: this.multipleConfig,
      searchPlaceholder: this.searchPlaceholder,
      optionTemplate: this.templateOption,
      alignItems: this.alignItems,
      minLoadChars: this._minLoadChars,
      alignment: this.alignment,
      isSearch: this.isSearch,
      searchValue,
      onClosed: () => {
        this.hideOptions();
      },
      onItemsSelected: (visibleItems: SelectItem[]) => {
        if (this.multiple) {
          this._active = [...OptionsBehavior.getLeafOptions(visibleItems).filter(o => !o.disabled)];
          this.changeDetector.markForCheck();
          this.emitChange();

          setTimeout(() => {
            if (this.optionsOpened) {
              this.updatePosition();
              this.optionsInstanceRef.instance.setValue(this.active);
            }
          });
        }
      },
      onItemsDeselected: () => {
        if (this.multiple) {
          this._active = [];
          this.changeDetector.markForCheck();
          this.emitChange();

          setTimeout(() => {
            if (this.optionsOpened) {
              this.updatePosition();
              this.optionsInstanceRef.instance.setValue(this.active);
            }
          });
        }
      },
      onItemSelected: (item: SelectItem) => {
        if (this.multiple) {
          if (!this._active) {
            this._active = [];
          }
          (this._active as SelectItem[]).push(item);
          this._value = (this._active as SelectItem[]).map(v => v.ID);
        } else {
          this._active = item;
          this._value = item.ID;
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

    // listen for a general mousedown to close all options (mousedown is generated e. g. when a movable modal drag is started)
    this._clickedOutsideListener = this.renderer.listen('document', 'mousedown', ($event: MouseEvent) => {
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
        let active = this.findSelectedOption(this.options);

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

  private findSelectedOption(options: SelectItem[]): SelectItem | null {
    let result: SelectItem = null;
    options.forEach(o => {
      if (result) {
        return;
      }
      if (o.ID === this._value) {
        result = o;
        return;
      }
      if (o.hasChildren()) {
        result = this.findSelectedOption(o.children);
      }
    });
    return result;
  }

  private multipleWriteValue(values: any[]): void {
    if (values === null || values === undefined || values.length === 0) {
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
        let active: Array<SelectItem>;
        const current = this._active as SelectItem[];
        if (this.isGroupOptions) {
          const allAtomicOptions: SelectItem[] = OptionsBehavior.getLeafOptions(this.options);

          active = allAtomicOptions.filter(o => this._value.indexOf(o.ID) > -1);
        } else {
          if (!this._active || this.unsetNoMatch) {
            active = this.options.filter(o => this._value.indexOf(o.ID) > -1);
          }
        }
        if (active) {
          this._active = active;
          if (current?.length !== active.length) {
            const activeIDs = active.map((a) => a.ID);
            const rejected = this._value.filter((a) => !activeIDs.includes(a));
            this._value = activeIDs;
            console.warn(`Values [${rejected}] were not accepted by [is-select] because they do not belong to [items] and [unsetNoMatch] is set to true`);
            this.emitChange();
          }
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
    if (this.resize === false && this.multiple) {
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
          // how many options are below the first one (== are surely hidden)
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

          // check if the first option is also hidden
          const selectMatchEl: HTMLElement = this.element.nativeElement.querySelector('.ui-select-match');
          const selectMatchRect = selectMatchEl.getBoundingClientRect();
          if (firstTop >= selectMatchRect.top + (selectMatchRect.height / 2)) {
            // the first option is below options area, mark is as also hidden
            this.additionalValues ++;
          }
          this.changeDetector.markForCheck();
        });
      }
    }
  }
}
