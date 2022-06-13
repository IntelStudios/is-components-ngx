import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit, QueryList, ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  AssignStatus,
  DataStructure,
  InputSchema,
  IsInputMappingInput,
  IsInputMappingValue,
  IsInputSchemaFilter, IsInputSchemaFilterStatus
} from './is-input-mapping.interface';
import { IsInputMappingService } from './is-input-mapping.service';
import { isInputRequiredFilledValidator } from './is-input-mapping.validator';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'is-input-mapping',
  templateUrl: './is-input-mapping.component.html',
  styleUrls: ['./is-input-mapping.component.scss'],
  providers: [IsInputMappingService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IsInputMappingComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: IsInputMappingComponent,
      multi: true
    }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsInputMappingComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @ViewChildren('child')
  children: QueryList<IsInputMappingComponent>;

  @Input()
  set data(value: IsInputMappingInput) {
    if (typeof (value) === 'undefined') {
      value = null;
    }

    this._data = value;

    if (this.data) {
      if (this.level === 0) {
        this.paintedStructure = this._data.DataStructure;
      }
    } else {
      this.paintedStructure = {
        Children: [], DataType: 0, InputColumns: [], Name: '', Path: '', Type: 0
      };
    }
    this.cd.detectChanges();

    if (this.level === 0) {
      if (this.data) {
        if (this._unappliedValue) {
          this.applyValue();
        }
        setTimeout(() => {
          this.service.clearInvalidAssigns(this.data.DataStructure, this.data.InputSchema.map((x) => x.Name), this.inputFilters);
          this.cd.markForCheck();
          if (this._validatorOnChange) {
            this._validatorOnChange();
          }
        });
      } else {
        if (this._validatorOnChange) {
          this._validatorOnChange();
        }
      }
    }
  }
  get data(): IsInputMappingInput {
    return this._data;
  }

  private _filtersAllowed = true;
  @Input()
  set filtersAllowed(val: boolean) {
    this._filtersAllowed = val;
    this.cd.markForCheck();
  }

  get filtersAllowed(): boolean {
    return this._filtersAllowed;
  }

  @Input()
  paintedPath: number[] = null; // taken from root element

  @Input()
  service: IsInputMappingService; // taken from root element

  @Input()
  showOnlyFiltered = false;

  inputsAssignableFiltered: InputSchema[] = [];
  inputsAssigned: InputSchema[] = [];
  inputsFilled: InputSchema[] = [];
  paintedStructure: DataStructure; // the part of the data that this element represents

  icon: string;
  collapsed = true;
  filters: IsInputSchemaFilter[] = [];
  assignDropdownVisible = false;
  filterDropdownVisible = false;
  newFilterModalVisible = false;
  newFilterModalType: string;
  newFilterModalValue: FormControl = new FormControl();

  // the value of this element, only used in the root instance
  inputSchemaMap: Map<string, string> = new Map<string, string>();
  inputFilters: { [id: string]: IsInputSchemaFilter[] } = {};

  level: number = null;
  collapsible = false;

  private _inputsAssignable: InputSchema[] = [];
  private _data: IsInputMappingInput = null;
  private _mouseover = false;
  private _mouseoverSubject = new Subject<boolean>();
  private _validator: Function;
  private _validatorOnChange: Function;

  // if value was set and no data before, then cache the value
  private _unappliedValue: IsInputMappingValue = null;
  private _unappliedMappedValue: Map<string, string> = null;

  set mouseover(value: boolean) {
    this._mouseoverSubject.next(value);
    if (value) { // apply mouseover immediately
      this._mouseover = value;
    }
  }

  get mouseover(): boolean {
    return this._mouseover;
  }

  private _disabled = false;
  set disabled(value: boolean) {
    this._disabled = value;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  private _subscriptions: Subscription[] = [];
  private _on_changes: Function = () => { };

  constructor(private elRef: ElementRef, private serviceRoot: IsInputMappingService, private cd: ChangeDetectorRef) {
  }

  @HostListener('document:click', ['$event'])
  clickGlobal(event) {
    if ((this.assignDropdownVisible || this.filterDropdownVisible) && !this.elRef.nativeElement.contains(event.target)) {
      this.assignDropdownHide();
      this.filterDropdownHide();
      this.filterModalHide();
    }
  }

  ngOnInit() {
    // Initialize service on root element
    if (!this.paintedPath) { // root element
      this.level = 0;
      this.paintedPath = [];
      this.service = this.serviceRoot;
      this.inputSchemaMap = new Map<string, string>();
      this.collapsible = true;
      this._validator = isInputRequiredFilledValidator(this);

      if (this._data) {
        this.paintedStructure = this._data.DataStructure;
      }

    } else { // no root
      let paintedData: DataStructure = this._data.DataStructure;

      for (const pathIndex of this.paintedPath) {
        paintedData = paintedData.Children[pathIndex];
      }

      this.paintedStructure = paintedData;
      this.level = this.paintedPath.length;
      this.collapsible = this.paintedStructure.Children.length > 0;
    }

    // Get all assignable items and assign items saved from the service state
    if (this.level > 0) {
      this._inputsAssignable = this._data.InputSchema.slice().filter(input => this.paintedStructure.InputColumns.indexOf(input.Name) > -1);
      const alreadyAssignedNames = this.service.getAssignedItemNames();
      this.inputsAssignableFiltered = this._inputsAssignable.slice().filter(item => alreadyAssignedNames.indexOf(item.Name) === -1);

      this.service.getAssignedItems(this.paintedStructure.Path).forEach(item => this.assignCallback(item));
    }

    // Get correct icon
    if (!this.collapsible) {
      this.icon = this.getDataTypeIcon(this.paintedStructure.DataType);
    } else {
      this.icon = this.getTypeIcon(this.paintedStructure.Type); // folder
    }

    // Check if disabled
    this.setDisabled(!this.service.isAssignable(this.paintedPath, this.collapsible), true);

    // debounce quick changes in mouseover states
    this._subscriptions.push(this._mouseoverSubject.asObservable().pipe(debounceTime(20)).subscribe(value => this._mouseover = value));

    // subscribe to disabled state change
    this._subscriptions.push(this.service.disabledChange$.subscribe(
      val => this.setDisabled(val || !this.service.isAssignable(this.paintedPath, this.collapsible)))
    );

    // subscribe to assigning items
    this._subscriptions.push(this.service.itemAssigned$.subscribe(item => this.assignCallback(item)));

    // subscribe to releasing items
    this._subscriptions.push(this.service.itemReleased$.subscribe(data => {
      if (data.Path === this.paintedStructure.Path) {
        // release the item if it was taken by us
        this.inputsAssigned = this.inputsAssigned.filter(input => input.Name !== data.Item.Name);
      }

      this.inputsFilled = this.inputsFilled.filter(input => input.Name !== data.Item.Name);

      this.setDisabled(!this.service.isAssignable(this.paintedPath, this.collapsible), true);

      // add released item back to available items
      for (const item of this._inputsAssignable) {
        if ((item.Name === data.Item.Name) && (this.inputsAssignableFiltered.filter(input => input.Name === item.Name).length === 0)) {
          this.inputsAssignableFiltered.push(item);
          this.inputsAssignableFiltered.sort();
          break;
        }
      }

      // root element saves the selection state into value
      if (this.level === 0) {
        this.inputSchemaMap.delete(data.Item.Name);
        if (!data.hasOwnProperty('EmmitChange') || data.EmmitChange) {
          this.propagateNewValue();
        }
      }
    }));

    // subscribe to new filters
    this._subscriptions.push(this.service.filterChange$.subscribe(filter => {
      if (filter.Path !== this.paintedStructure.Path && this.level !== 0 && filter.Path !== null) {
        // this filter is not for us
        return;
      }

      if (this.level === 0) {
        if (filter.Path === null && filter.Filters.length === 0) {
          this.inputFilters = {};
        } else {
          this.inputFilters[filter.Path] = filter.Filters;
          if (this.inputFilters[filter.Path].length === 0) {
            delete this.inputFilters[filter.Path];
          }
        }
        if (filter.EmmitChange) {
          this.propagateNewValue();
        }
        return;
      }

      this.filters = filter.Filters;

      this.cd.markForCheck();
    }));

    // apply filters from cache
    this.service.applyCachedFilters(this.paintedStructure.Path);

    // apply new HTML changes if root node
    if (this.level === 0) {
      this.cd.markForCheck();
    }
  }

  /**
   * Toggles collapsed status of this node
   * Does nothing if not collapsible
   */
  toggleCollapsed(): void {
    if (!this.collapsible) {
      return;
    }

    this.collapsed = !this.collapsed;
    this.icon = this.getTypeIcon(this.paintedStructure.Type);
    this.cd.markForCheck();
  }

  /**
   * Shows new item assign dropdown
   * Does nothing if enabled
   */
  assignDropdownShow() {
    if (this.disabled) {
      return;
    }

    this.assignDropdownVisible = true;
  }

  /**
   * Hides new item assign dropdown
   * Does nothing if enabled
   */
  assignDropdownHide(): void {
    if (this.disabled) {
      return;
    }

    this.assignDropdownVisible = false;
  }

  /**
   * Shows filtering dropdown
   * Does nothing if enabled
   */
  filterDropdownShow(): void {
    if (this.disabled) {
      return;
    }

    this.filterDropdownVisible = true;
  }

  /**
   * Hides filtering dropdown
   * Does nothing if enabled
   */
  filterDropdownHide(): void {
    if (this.disabled) {
      return;
    }

    this.filterDropdownVisible = false;
  }

  /**
   * Shows filtering modal
   * Does nothing if enabled
   */
  filterModalShow(): void {
    if (this.disabled) {
      return;
    }

    this.newFilterModalVisible = true;
  }

  /**
   * Hides filtering modal
   * Does nothing if enabled
   */
  filterModalHide(): void {
    if (this.disabled) {
      return;
    }

    this.newFilterModalVisible = false;
  }

  /**
   * Assigns given item to this node by calling service
   * @param item item to be assigned here
   */
  assign(item: InputSchema) {
    this.service.assignItem({ Item: item, PaintedPath: this.paintedPath, Path: this.paintedStructure.Path });
  }

  /**
   * Calls service to release given items from this node
   * Does nothing if node is disabled
   * @param item item to be released
   */
  release(item: InputSchema) {
    if (this.disabled) {
      return;
    }
    this.service.releaseItem({ Item: item, PaintedPath: this.paintedPath, Path: this.paintedStructure.Path });
  }

  /**
   * Ges all assignable items and checks if they are assigned
   */
  getAllItems(): {item: InputSchema; assigned: boolean}[] {
    if (!this.data) {
      return [];
    }
    const assignedNames = this.service.getAssignedItemNames();
    return this.data.InputSchema.map(item => ({item, assigned: assignedNames.indexOf(item.Name) > -1}));
  }

  /**
   * Get children paint path
   * @param i index of the children to get the path of
   * @returns painted path of the children
   */
  getChildPath(i: number): number[] {
    const path = this.paintedPath.slice();
    path.push(i);

    return path;
  }

  getTypeIcon(type: number): string {
    switch (type) {
      case 1:
        return 'fa fa-code-fork'; // complex
      case 2:
        return 'fa fa-tasks'; // tbd
      case 3:
        // endpoint
        return 'fa fa-plug';
      default:
        return !this.collapsed ? 'fa fa-folder' : 'fa fa-folder-open';
    }
  }

  getDataTypeIcon(type: number): string {
    switch (type) {
      case 1:
        // int
        return 'fa fa-pause';
      case 2:
        // string
        return 'fa fa-font';
      case 3:
        // boolean
        return 'fa fa-columns';
      case 4:
        // base64
        return 'fa fa-database';
      case 5:
        // datetime
        return 'fa fa-calendar';
      case 6:
        // double
        return 'fa fa-angle-double-up';
      case 7:
        // complex
        return 'fa fa-code-fork';
      case 8:
        // json - requires FontAwesome pro
        return 'fas fa-brackets-curly';
    }
  }

  /**
   * Gets all filter type names based of node type
   * @param type node type
   */
  getDataTypeFilters(type: number): string[] {
    switch (type) {
      case 2:
        // string
        return ['StringEq', 'StringNotEq'];
    }

    return [];
  }

  /**
   * Tests if this node can apply any filters
   * @param type node type to test
   */
  hasDataTypeFilters(type: number): boolean {
    return this.getDataTypeFilters(type).length > 0;
  }

  getFilterTypeIcon(type: string): string {
    switch (type) {
      case 'StringEq':
        return 'fas fa-equals';
      case 'StringNotEq':
        return 'fas fa-not-equal';
    }
  }

  getFilterTypeContent(type: string): string {
    switch (type) {
      case 'StringEq':
        return '=';
      case 'StringNotEq':
        return '≠';
    }
  }

  getFilterTypeName(type: string): string {
    switch (type) {
      case 'StringEq':
        return 'equals';
      case 'StringNotEq':
        return 'not equals';
    }
  }

  /**
   * Propagates new value to FormValueAccessor after validator checking
   */
  private propagateNewValue(): void {
    const value: IsInputMappingValue = {InputSchemaFilter: this.inputFilters, InputSchemaMapping: this.inputSchemaMap};
    if (this.level === 0 && this._validatorOnChange) {
      this._validatorOnChange();
      setTimeout(() => this._on_changes(value));
    } else {
      this._on_changes(value);
    }
  }

  /**
   * Adds new filter to this node with given type
   * @param filterType type of the filter
   */
  createNewDataFilter(filterType: string) {
    this.newFilterModalType = filterType;
    this.newFilterModalValue.setValue(null);
    this.filterModalShow();
    this.filterDropdownHide();
  }

  /**
   * Applies new filter to this node
   */
  applyNewFilter(): void {
    if (!this.newFilterModalValue.value) {
      return;
    }
    const newFilters = this.filters.slice();
    newFilters.push({
      Type: this.newFilterModalType,
      Value: this.newFilterModalValue.value
    });
    const newStatus: IsInputSchemaFilterStatus = {
      Path: this.paintedStructure.Path,
      Filters: newFilters,
      EmmitChange: true
    };

    this.service.applyFilters(newStatus);
    this.filterDropdownHide();
    this.filterModalHide();
  }

  /**
   * Applies previously unapplied value and filters to all nodes by calling service
   */
  applyValue(): void {
    const value = this._unappliedValue;
    const mappedValue = this._unappliedMappedValue;

    this._unappliedValue = null;
    this._unappliedMappedValue = null;

    // clear all previous values
    this.service.releaseAllItems();
    this.service.releaseAllFilters();

    if (!mappedValue) {
      return;
    }

    const findNodePaintedPathByPath = (rootPath: string, struct: DataStructure, paintedPath: number[]): number[] => {
      if (struct.Path === rootPath) {
        return paintedPath;
      }

      for (let i = 0; i < struct.Children.length; i++) {
        const child = struct.Children[i];
        const paintedChildPath = paintedPath.slice();
        paintedChildPath.push(i);
        if (rootPath.startsWith(child.Path)) {
          const returnedData = findNodePaintedPathByPath(rootPath, child, paintedChildPath);
          if (returnedData) {
            return returnedData;
          }
        }
      }
      return null;
    };

    const findItemByName = (name): InputSchema => {
      for (const schema of this._data.InputSchema) {
        if (schema.Name === name) {
          return schema;
        }
      }

      return null;
    };

    mappedValue.forEach((path, itemName) => {
      const nodePaintedPath = findNodePaintedPathByPath(path, this._data.DataStructure, []);
      const item = findItemByName(itemName);

      if (!nodePaintedPath || !item) {
        return;
      }

      this.service.assignItem({ Item: item, Path: path, PaintedPath: nodePaintedPath, EmmitChange: false });
    });

    if (value.InputSchemaFilter) {
      Object.keys(value.InputSchemaFilter).forEach((path: string) => {
        this.service.applyFilters({Path: path, Filters: value.InputSchemaFilter[path], EmmitChange: false});
      });
    }

    this.cd.markForCheck();
  }

  /**
   * Removes filter from this node
   * Does not work if disabled
   * @param filter filter to be released from this node
   */
  releaseFilter(filter: IsInputSchemaFilter): void {
    if (this.disabled) {
      return;
    }
    const newFilters = this.filters.filter(f => f !== filter);
    const newStatus: IsInputSchemaFilterStatus = {
      Path: this.paintedStructure.Path,
      Filters: newFilters,
      EmmitChange: true
    };

    this.service.applyFilters(newStatus);
  }

  /*
   * Control value accessor
   */
  writeValue(value: IsInputMappingValue): void {
    let mappedValue: Map<string, string>;
    if (value) {
      if (value.InputSchemaMapping instanceof Map) {
        mappedValue = new Map(value.InputSchemaMapping);
      } else {
        mappedValue = new Map<string, string>();
        Object.keys(value.InputSchemaMapping).forEach(k => mappedValue.set(k, value.InputSchemaMapping[k]));
      }
    }

    this._unappliedValue = value;
    this._unappliedMappedValue = mappedValue;

    if (!this.data) {
      return;
    }

    this.applyValue();
  }

  /*
   * Control value accessor
   */
  registerOnChange(fn: Function): void {
    this._on_changes = fn;
  }

  /*
   * Control value accessor
   */
  registerOnTouched(fn: any): void {
  }

  /*
   * Control value accessor
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.service.setDisabled(this.disabled);
  }

  /**
   * Callback for new assign request.
   * If the request is meant to be assigned to this node, adds it to locally assigned
   * For root node update value
   * @param status request returned from mapping service
   */
  private assignCallback(status: AssignStatus) {
    if (status.Path === this.paintedStructure.Path) {
      // assign this item here if it was meant for us
      this.inputsAssigned.push(status.Item);
    }

    this.inputsAssignableFiltered = this.inputsAssignableFiltered.filter(input => input.Name !== status.Item.Name);
    this.inputsFilled.push(status.Item);

    this.setDisabled(!this.service.isAssignable(this.paintedPath, this.collapsible), true);

    // root element saves the selection state into value
    if (this.level === 0) {
      this.inputSchemaMap.set(status.Item.Name, status.Path);
      if (!status.hasOwnProperty('EmmitChange') || status.EmmitChange) {
        this.propagateNewValue();
      }
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Sets disabled state on this component
   * @param value true if disabled, false if enabled
   * @param clearFilters if set to true, then all filters of this node are released
   */
  setDisabled(value: boolean, clearFilters = false): void {
    this.disabled = value;
    if (value && clearFilters) {
      this.service.applyFilters({Path: this.paintedStructure.Path, Filters: [], EmmitChange: true});
    }
  }

  /**
   * Validates if this components value if valid
   * Always valid on non-root component
   */
  validate(control: AbstractControl): ValidationErrors {
    if (this.level === 0) {
      return this._validator(control);
    }
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this._validatorOnChange = fn;
  }

  /***
   * Assigns all items that are meant to be assigned to this node (and possible its children)
   * @param toAssign if null then all available items are used
   * @return all assignable items to this node and its children
   */
  autoassign(toAssign: Array<InputSchema> = null): Array<InputSchema> {
    if (this.disabled) {
      return toAssign;
    }

    if (toAssign === null) {
      toAssign = this.getAllItems().filter((x) => !x.assigned).map((x) => x.item);
    }

    // keep only those which cannot be assigned here and assign those which can
    toAssign = toAssign.filter((item) => {
      if (this.inputsAssignableFiltered.indexOf(item) !== -1 && item.Name === this.paintedStructure.Name) {
        this.assign(item);
        return false;
      }

      return true;
    });

    if (toAssign.length) {
      // recursive assign the unassigned
      this.children.forEach((child) => {
        if (!toAssign.length) {
          return;
        }

        toAssign = child.autoassign(toAssign);
      });
    }

    return toAssign;
  }
}
