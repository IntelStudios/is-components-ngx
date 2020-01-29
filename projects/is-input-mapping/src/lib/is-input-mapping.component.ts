import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { AssignStatus, DataStructure, InputSchema, IsInputMappingInput } from './is-input-mapping.interface';
import { IsInputMappingService } from './is-input-mapping.service';

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
    }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsInputMappingComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input()
  set data(value: IsInputMappingInput) {
    if (typeof (value) === 'undefined') {
      value = null;
    }

    this._data = value;

    if (this.data) {
      if (this.level === 0) {
        this.service.clearInvalidAssigns(this.data.DataStructure);
        this.paintedStructure = this._data.DataStructure;
        this.cd.detectChanges();
      }
    }
  }
  get data(): IsInputMappingInput {
    return this._data;
  }

  @Input()
  paintedPath: number[] = null; // taken from root element

  @Input()
  service: IsInputMappingService; // taken from root element

  inputsAssignableFiltered: InputSchema[] = [];
  inputsAssigned: InputSchema[] = [];
  inputsFilled: InputSchema[] = [];
  paintedStructure: DataStructure; // the part of the data that this element represents

  icon: string;
  collapsed = true;
  dropdownVisible = false;

  inputSchemaMap: Map<string, string>;  // the value of this element, only used in the root instance

  level: number = null;
  collapsible = false;

  private _inputsAssignable: InputSchema[] = [];
  private _data: IsInputMappingInput = null;
  private _mouseover = false;
  private _mouseoverSubject = new Subject<boolean>();

  set mouseover(value: boolean) {
    this._mouseoverSubject.next(value);
    if (value) { // apply mouseover immediately
      this._mouseover = value;
    }
  }

  get mouseover(): boolean {
    return this._mouseover;
  }

  disabled = false;

  private _subscriptions: Subscription[] = [];
  private _on_changes: Function = () => { };

  constructor(private elRef: ElementRef, private serviceRoot: IsInputMappingService, private cd: ChangeDetectorRef) {
  }

  @HostListener('document:click', ['$event'])
  clickGlobal(event) {
    if (this.dropdownVisible && !this.elRef.nativeElement.contains(event.target)) {
      this.dropdownHide();
    }
  }

  ngOnInit() {
    if (!this.paintedPath) { // root element
      this.level = 0;
      this.paintedPath = [];
      this.service = this.serviceRoot;
      this.inputSchemaMap = new Map<string, string>();
      this.collapsible = true;

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

    if (!this.collapsible) { // node that can have attached items
      this._inputsAssignable = this._data.InputSchema.slice().filter(input => this.paintedStructure.InputColumns.indexOf(input.Name) > -1);
      const alreadyAssignedNames = this.service.getAssignedItemNames();
      this.inputsAssignableFiltered = this._inputsAssignable.slice().filter(item => alreadyAssignedNames.indexOf(item.Name) === -1);
      this.icon = this.getTypeIcon(this.paintedStructure.DataType);

      this.service.getAssignedItems(this.paintedStructure.Path).forEach(item => this.assignCallback(item));
    } else {
      this.icon = !this.collapsed ? 'fa-folder' : 'fa-folder-open'; // folder
    }

    this.disabled = !this.service.isAssignable(this.paintedPath, this.collapsible);

    // debounce quick changes in mouseover states
    this._subscriptions.push(this._mouseoverSubject.asObservable().pipe(debounceTime(20)).subscribe(value => this._mouseover = value));

    // subscribe to assigning items
    this._subscriptions.push(this.service.itemAssigned$.subscribe(item => this.assignCallback(item)));

    // subscribe to releasing items
    this._subscriptions.push(this.service.itemReleased$.subscribe(data => {
      if (data.Path === this.paintedStructure.Path) {
        // release the item if it was taken by us
        this.inputsAssigned = this.inputsAssigned.filter(input => input.Name !== data.Item.Name);
      }

      this.inputsFilled = this.inputsFilled.filter(input => input.Name !== data.Item.Name);

      this.disabled = !this.service.isAssignable(this.paintedPath, this.collapsible);

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
          this._on_changes(this.inputSchemaMap);
        }
      }
    }));
  }

  toggleCollapsed() {
    if (!this.collapsible || this.disabled) {
      return;
    }

    this.collapsed = !this.collapsed;
    this.icon = !this.collapsed ? 'fa-folder' : 'fa-folder-open'; // folder
    this.cd.markForCheck();
  }

  dropdownShown() {
    if (this.disabled) {
      return;
    }

    this.dropdownVisible = true;
  }

  dropdownHide() {
    if (this.disabled) {
      return;
    }

    this.dropdownVisible = false;
  }

  assign(item: InputSchema) {
    this.service.assignItem({ Item: item, PaintedPath: this.paintedPath, Path: this.paintedStructure.Path });
  }

  release(item: InputSchema) {
    this.service.releaseItem({ Item: item, PaintedPath: this.paintedPath, Path: this.paintedStructure.Path });
  }

  getChildPath(i: number): number[] {
    const path = this.paintedPath.slice();
    path.push(i);

    return path;
  }

  getTypeIcon(type: number) {
    switch (type) {
      case 1:
        // int
        return 'fa-pause';
      case 2:
        // string
        return 'fa-font';
      case 3:
        // boolean
        return 'fa-columns';
      case 4:
        // base64
        return 'fa-database';
      case 5:
        // datetime
        return 'fa-calendar';
      case 6:
        // double
        return 'fa-angle-double-up';
      case 7:
        // complex
        return 'fa-code-fork';
    }
  }

  /*
   * Control value accessor
   */
  writeValue(value: Map<string, string>): void {
    value = new Map(value);
    if (!this.data) {
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

    // clear all previous values
    this.inputSchemaMap.forEach((path, itemName) => {
      const nodePaintedPath = findNodePaintedPathByPath(path, this._data.DataStructure, []);
      const item = findItemByName(itemName);

      if (!nodePaintedPath || !item) {
        return;
      }

      this.service.releaseItem({ Item: item, Path: path, PaintedPath: nodePaintedPath, EmmitChange: false });
    });

    if (!value) {
      return;
    }

    value.forEach((path, itemName) => {
      const nodePaintedPath = findNodePaintedPathByPath(path, this._data.DataStructure, []);
      const item = findItemByName(itemName);

      if (!nodePaintedPath || !item) {
        return;
      }

      this.service.assignItem({ Item: item, Path: path, PaintedPath: nodePaintedPath, EmmitChange: false });
    });

    this.cd.markForCheck();
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
  }

  private assignCallback(status: AssignStatus) {
    if (status.Path === this.paintedStructure.Path) {
      // assign this item here if it was meant for us
      this.inputsAssigned.push(status.Item);
    }

    this.inputsAssignableFiltered = this.inputsAssignableFiltered.filter(input => input.Name !== status.Item.Name);
    this.inputsFilled.push(status.Item);

    this.disabled = !this.service.isAssignable(this.paintedPath, this.collapsible);

    // root element saves the selection state into value
    if (this.level === 0) {
      this.inputSchemaMap.set(status.Item.Name, status.Path);
      if (!status.hasOwnProperty('EmmitChange') || status.EmmitChange) {
        this._on_changes(this.inputSchemaMap);
      }
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe());
  }
}
