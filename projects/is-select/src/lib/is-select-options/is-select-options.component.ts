import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';

import { IOptionsBehavior, ChildrenOptionsBehavior, GenericOptionsBehavior } from '../options-behavior';
import { IsSelectOptionDirective } from '../is-select.directives';
import { SelectItem } from '../select-item';
import { createFilterRegexp } from 'is-text-utils';

export interface ISelectOptionsControl {
  active: SelectItem | SelectItem[];
  optionTemplate: IsSelectOptionDirective;
  searchPlaceholder: string;
  options: SelectItem[];
  alignItems: 'left' | 'right';
  alignment: 'left' | 'right' | 'center';
  minLoadChars: number;
  isSearch: boolean;
  multiple: boolean;
  onClosed: () => void;
  onLoadOptions: (filter: string) => void;
  onItemSelected: (item: SelectItem) => void;
  onItemUnselected: (item: SelectItem) => void;
}

@Component({
  selector: 'is-select-options',
  templateUrl: './is-select-options.component.html',
  styleUrls: ['./is-select-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsSelectOptionsComponent implements OnInit, AfterViewInit {

  @ViewChild('optionSingle', { static: true })
  optionSingleTemplate: TemplateRef<any>;

  @ViewChild('optionMulti', { static: true })
  optionMultiTemplate: TemplateRef<any>;

  optionMainTemplate: TemplateRef<any>;

  control: ISelectOptionsControl;

  activeOption: SelectItem;
  value: SelectItem | SelectItem[];

  visibleOptions: SelectItem[];
  options: SelectItem[];

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

  private behavior: IOptionsBehavior;
  private searchFilter: string = '';
  isLoadingOptions : boolean = false;


  get firstItemHasChildren(): boolean {
    return this.options[0] && this.options[0].hasChildren();
  }

  get singleValue(): SelectItem {
    return this.value as SelectItem;
  }

  get multiValue(): SelectItem[] {
    return this.value as SelectItem[];
  }

  constructor(private changeDetector: ChangeDetectorRef, public element: ElementRef) { }


  ngOnInit() {

    this.options = this.control.options;
    this.value = this.control.active;
    this.searchPlaceholder = this.control.searchPlaceholder;
    this.alignment = this.control.alignment;
    this.alignItems = this.control.alignItems;
    this.optionTemplate = this.control.optionTemplate;
    this.isSearch = this.control.isSearch;
    this.multiple = this.control.multiple;
    // decide which templateRef are we gonna use to render a single option
    this.optionMainTemplate = this.multiple ? this.optionMultiTemplate : this.optionSingleTemplate;

    // neccessary check if you are using select with groups
    if (this.firstItemHasChildren) {
      if (this.options.findIndex((item: SelectItem) => item.children === null || item.children === undefined) > -1) {
        // it is required that every parent must have own child/ren
        console.warn('Every item of the array must have children, filtering items without children...');
        this.options = this.control.options.filter((item: SelectItem) => item.children);
      }
      this.behavior = new ChildrenOptionsBehavior(this);
    } else {
      this.behavior = new GenericOptionsBehavior(this);
    }
    this.visibleOptions = this.options;

    this.markCheckedOptions();

    if (this.multiple && this.value) {
      this.selectedOptions = (this.value as SelectItem[]).map(v => {v.Checked = true; return v;});
      this.options = this.options.filter(o => !o.Checked);
    }

    this.behavior.reset();

    if (this.visibleOptions.length > 0 && (!this.control.active || !this.activeOption)) {
      this.behavior.first();
    }
  }

  ngAfterViewInit() {
    this.focusToInput();
    this.scrollToSelected();
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
    this.markCheckedOptions();
    this.changeDetector.markForCheck();
  }

  setOptions(options: SelectItem[]) {
    this.visibleOptions = options;
    this.options = options;
    this.markCheckedOptions();
    if (options && this.isLoadingOptions && this.searchFilter && this.searchFilter.length >= this.control.minLoadChars) {
      this.options = this.options.filter(o => !o.Checked);
      this.behavior.filter(createFilterRegexp(this.searchFilter));
      this.isLoadingOptions = false;
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
    !this.control.multiple && this.control.onClosed();
  }

  selectActive(value: SelectItem) {
    this.activeOption = value;
    this.changeDetector.markForCheck();
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
      const el: any = this.element.nativeElement.querySelector('div.ui-select-search > input');
      if (!el.value || el.value.length <= 0) {
        if (this.value) {
          this.control.onItemUnselected(this.activeOption);
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
      this.control.onItemSelected(this.activeOption);
      this.control.onClosed();
      return;
    }
  }

  sanitize(html: string): any {
    // disable sanitizing as it breaks
    // selection event handlers in firefox
    return html;
  }

  isActive(value: SelectItem): boolean {
    if (!this.activeOption) {
      return;
    }
    return this.activeOption.ID === value.ID;
  }

  scrollToSelected() {
    const selectedElement = this.element.nativeElement.querySelector('div.ui-select-choices-row.selected');
    if (selectedElement === null) {
      return;
    }
    this.element.nativeElement.querySelector('ul.ui-select-choices').scrollTop = selectedElement.offsetTop - 40;
  }

  private markCheckedOptions() {
    // set Checked property to options
    if (this.multiple && this.value) {
      const values = this.value as SelectItem[];
      this.options.forEach(o => {
        o.Checked = values.findIndex(v => v.ID === o.ID) > -1;
      });
      if (this.selectedOptions) {
        this.selectedOptions.forEach(o => {
          o.Checked = values.findIndex(v => v.ID === o.ID) > -1;
        });
      }
    }
  }
}
