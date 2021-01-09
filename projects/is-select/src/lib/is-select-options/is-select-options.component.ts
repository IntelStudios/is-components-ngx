import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, AfterViewInit, TemplateRef, ViewChild, Optional } from '@angular/core';

import { IOptionsBehavior, ChildrenOptionsBehavior, GenericOptionsBehavior, OptionsBehavior } from '../options-behavior';
import { IsSelectOptionDirective } from '../is-select.directives';
import { SelectItem } from '../select-item';
import { createFilterRegexp } from 'is-text-utils';
import { configToken, IsSelectConfig, IsSelectMultipleConfig } from '../is-select.interfaces';
import { IsSelectOptionsService } from '../is-select.options.service';
import { Inject } from '@angular/core';

export interface ISelectOptionsControl {
  active: SelectItem | SelectItem[];
  optionTemplate: IsSelectOptionDirective;
  searchPlaceholder: string;
  options: SelectItem[];
  alignItems: 'left' | 'right';
  alignment: 'left' | 'right' | 'center';
  minLoadChars: number;
  isGroupOptions: boolean;
  isSearch: boolean;
  multipleConfig: IsSelectMultipleConfig;
  onClosed: () => void;
  onLoadOptions: (filter: string) => void;
  onItemSelected: (item: SelectItem) => void;
  onItemUnselected: (item: SelectItem) => void;
  onItemsSelected: () => void;
  onItemsDeselected: () => void;
}

@Component({
  selector: 'is-select-options',
  templateUrl: './is-select-options.component.html',
  styleUrls: ['./is-select-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [IsSelectOptionsService],
})
export class IsSelectOptionsComponent implements OnInit, AfterViewInit {

  @ViewChild('optionSingle', { static: true })
  optionSingleTemplate: TemplateRef<any>;

  @ViewChild('optionMulti', { static: true })
  optionMultiTemplate: TemplateRef<any>;

  optionMainTemplate: TemplateRef<any>;

  control: ISelectOptionsControl;

  get activeOption(): SelectItem {
    return this.optionsService.activeOption;
  }
  value: SelectItem | SelectItem[];

  visibleOptions: SelectItem[];
  options: SelectItem[];
  isGroupOptions: boolean;

  /**
   * in multi-mode these options are rendered on top
   */
  selectedOptions: SelectItem[];

  alignment: 'left' | 'right' | 'center';
  alignItems: 'left' | 'right';
  searchPlaceholder: string;
  optionTemplate: IsSelectOptionDirective;
  isSearch: boolean;
  multiple: boolean;
  multipleConfig: IsSelectMultipleConfig;

  private behavior: IOptionsBehavior;
  private searchFilter: string = '';
  isLoadingOptions: boolean = false;

  get singleValue(): SelectItem {
    return this.value as SelectItem;
  }

  get multiValue(): SelectItem[] {
    return this.value as SelectItem[];
  }

  constructor(
    private changeDetector: ChangeDetectorRef,
    public element: ElementRef,
    private optionsService: IsSelectOptionsService,
    @Optional() @Inject(configToken) private selectConfig: IsSelectConfig
  ) { }


  ngOnInit() {

    this.options = this.control.options;
    this.isGroupOptions = this.control.isGroupOptions;
    this.value = this.control.active;
    this.searchPlaceholder = this.control.searchPlaceholder;
    this.alignment = this.control.alignment;
    this.alignItems = this.control.alignItems;
    this.optionTemplate = this.control.optionTemplate;
    this.isSearch = this.control.isSearch;
    this.multipleConfig = this.control.multipleConfig;

    this.optionsService.setSingleValue(this.singleValue);
    if (this.multipleConfig) {
      // apply defaults
      this.multipleConfig = {
        ...{
          showButtons: false,
          selectAll: {
            cssClass: 'btn-primary',
            label: 'Select All'
          }, deselectAll: {
            cssClass: 'btn-secondary',
            label: 'Deselect All'
          }
        },
        ...this.multipleConfig
      };
    }

    this.multiple = !!this.multipleConfig;
    // decide which templateRef are we gonna use to render a single option
    this.optionMainTemplate = this.multiple ? this.optionMultiTemplate : this.optionSingleTemplate;

    if (this.isGroupOptions) {
      this.behavior = new ChildrenOptionsBehavior(this);
    } else {
      this.behavior = new GenericOptionsBehavior(this);
    }
    this.visibleOptions = this.options;

    this.markCheckedOptions(this.options);

    if (this.multiple && this.value) {
      this.selectedOptions = (this.value as SelectItem[]).map(v => { v.Checked = true; return v; });
      this.options = OptionsBehavior.filterPredicate(this.options, (opt) => !opt.Checked);
    }

    this.behavior.reset();

    if (this.visibleOptions.length > 0 && (!this.control.active || !this.activeOption)) {
      this.behavior.first();
    }
  }

  ngAfterViewInit() {
    this.focusToInput();
    this.scrollToSelected();

    if (this.control.minLoadChars === 0) {
      setTimeout(() => {
        // immediatelly request options from client
        this.isLoadingOptions = true;
        this.control.onLoadOptions('');
        this.changeDetector.markForCheck();
      });
    }

  }

  focusToInput(value: string = ''): void {
    setTimeout(() => {
      const el = this.element.nativeElement.querySelector('div.ui-select-search > input');
      if (el) {
        el.focus();
        el.value = value;
      }
    });
  }

  setValue(option: SelectItem | SelectItem[]) {
    this.value = option;
    this.markCheckedOptions(this.options);
    this.changeDetector.markForCheck();
  }

  selectAll() {
    this.control.onItemsSelected();
  }

  deselectAll() {
    this.control.onItemsDeselected();
  }

  setOptions(options: SelectItem[]) {
    this.visibleOptions = options;
    this.options = options;

    // re-check options - may change because of lazy load
    const isGroupOpts = this.options && this.options.findIndex(o => o.hasChildren()) > -1;

    if (isGroupOpts) {
      this.behavior = new ChildrenOptionsBehavior(this);
    } else {
      this.behavior = new GenericOptionsBehavior(this);
    }

    this.markCheckedOptions(this.options);
    if (options && this.isLoadingOptions && (this.control.minLoadChars === 0) || (this.searchFilter && this.searchFilter.length >= this.control.minLoadChars)) {
      this.options = this.options.filter(o => !o.Checked);
      this.behavior.filter(createFilterRegexp(this.searchFilter));
      this.isLoadingOptions = false;
      this.scrollToSelected();
    }

    this.changeDetector.markForCheck();
  }

  selectMatch(value: SelectItem, e: Event = void 0) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    // in single mode value will never have Checked property set
    value.Checked ? this.control.onItemUnselected(value) : this.control.onItemSelected(value);
    // only close options in single mode
    !this.control.multipleConfig && this.control.onClosed();
  }

  setActiveOption(option: SelectItem) {
    this.optionsService.setActiveOption(option);
  }

  onSearchChange($event: string) {
    this.searchFilter = $event;
    if (this.control.minLoadChars > 0) {
      if (this.searchFilter.length >= this.control.minLoadChars && !this.isLoadingOptions && this.control.options.length === 0) {
        this.isLoadingOptions = true;
        this.control.onLoadOptions(this.searchFilter);
      } else if (this.searchFilter.length < this.control.minLoadChars) {
        // clear options, because we need to load them again once user types minSearchChars
        // this.items = null;
        this.setOptions([]);
        if (this.isLoadingOptions) {
          // emit loadOptions event with null value - client should cancel option load
          this.control.onLoadOptions(null);
        }
        this.isLoadingOptions = false;
        // console.log('unset options');
      }
    }
    this.behavior.filter(createFilterRegexp(this.searchFilter));
  }

  inputEvent(e: KeyboardEvent, isUpMode: boolean = false): void {
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
      const el: any = this.element.nativeElement.querySelector('div.ui-select-search > input');
      if (!el.value || el.value.length <= 0) {
        if (this.value) {
          this.control.onItemUnselected(this.optionsService.activeOption);
        }
        this.control.onClosed();
        e.preventDefault();
      }
    }
    // esc
    if (!isUpMode && e.keyCode === 27) {
      this.control.onClosed();
      e.preventDefault();
      return;
    }
    // del
    // if (!isUpMode && e.keyCode === 46 && !this.optionsOpened) {
    //   if (this.active) {
    //     this.remove();
    //   }
    //   e.preventDefault();
    // }
    // left
    if (!isUpMode && e.keyCode === 37 && this.visibleOptions.length > 0) {
      this.behavior.first();
      e.preventDefault();
      return;
    }
    // right
    if (!isUpMode && e.keyCode === 39 && this.visibleOptions.length > 0) {
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
      e.preventDefault();
      if (this.control.options.some(x => x.Checked && x.ID === this.activeOption.ID)) {
        return;
      }
      this.control.onItemSelected(this.activeOption);
      if (this.multiple && e.ctrlKey) {
        const input = (e.target as HTMLInputElement);
        input.value = '';
        input.dispatchEvent(new Event('input'));
        return;
      }
      this.control.onClosed();
      return;
    }
  }

  onPaste($event: ClipboardEvent): boolean {
    console.log($event, this.selectConfig);
    if (!this.multiple || !this.selectConfig?.attemptToProcessPasteMultipleSearch) {
      return true;
    }
    $event.preventDefault();
    $event.stopPropagation();
    const text = $event.clipboardData.getData('text/plain');
    // this regex could be configurable
    const ids = Array.from(new Set([...text.split(/\s+|[,;]/g)]));
    const opts = this.control.options.filter(x => ids.includes(x.ID) && !x.Checked);
    opts.forEach((opt) => {
      this.control.onItemSelected(opt);
    });
  }

  sanitize(html: string): any {
    // disable sanitizing as it breaks
    // selection event handlers in firefox
    return html;
  }

  scrollToSelected() {
    const selectedElement = this.element.nativeElement.querySelector('div.ui-select-choices-row.selected');
    if (selectedElement === null) {
      return;
    }
    this.element.nativeElement.querySelector('ul.ui-select-choices').scrollTop = selectedElement.offsetTop - 40;
  }

  private markCheckedOptions(options: SelectItem[], checkSelected = true) {
    // set Checked property to options
    if (this.multiple && this.value) {
      const values = this.value as SelectItem[];
      options.forEach(o => {
        if (o.hasChildren()) {
          this.markCheckedOptions(o.children, false);
        } else {
          o.Checked = values.findIndex(v => v.ID === o.ID) > -1;
        }
      });
      if (this.selectedOptions && checkSelected) {
        this.selectedOptions.forEach(o => {
          o.Checked = values.findIndex(v => v.ID === o.ID) > -1;
        });
      }
    }
  }
}
