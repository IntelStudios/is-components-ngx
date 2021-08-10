import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AssignStatus, DataStructure, IsInputSchemaFilter, IsInputSchemaFilterStatus } from './is-input-mapping.interface';

@Injectable()
export class IsInputMappingService {

  private assignSource = new Subject<AssignStatus>();
  private releaseSource = new Subject<AssignStatus>();
  private disabledSource = new Subject<boolean>();
  private filterSource = new Subject<IsInputSchemaFilterStatus>();

  /*
  key: path of item that has assigns
  value: list of assigned AssignStatus
   */
  private assignedCache: { [id: string]: AssignStatus[]} = {};
  private isDisabled = false;

  itemAssigned$ = this.assignSource.asObservable();
  itemReleased$ = this.releaseSource.asObservable();
  disabledChange$ = this.disabledSource.asObservable();
  filterChange$ = this.filterSource.asObservable();

  /**
   * Applies new filter and notifies components
   * @param data filter data
   */
  applyFilter(data: IsInputSchemaFilterStatus): void {
    this.filterSource.next(data);
  }

  /**
   * Removes all filters and notifies components without emitting ValueChangeAccessor change event
   */
  releaseAllFilters(): void {
    this.filterSource.next({Path: null, Filters: [], EmmitChange: false});
  }

  /**
   * Assigns new item, saves it into cache and notifies components
   * @param data new assigned item data
   */
  assignItem(data: AssignStatus): void {
    if (!(data.Path in this.assignedCache)) {
      this.assignedCache[data.Path] = [];
    }

    if (data.hasOwnProperty('EmmitChange')) {
      // remove EmmitChange signature from data
      const dataCopy = Object.assign({}, data);
      delete dataCopy['EmmitChange'];
      this.assignedCache[data.Path].push(dataCopy);
    } else {
      this.assignedCache[data.Path].push(data);
    }
    this.assignSource.next(data);
  }

  /**
   * Releases assigned item and notifies components and removes it from assigned cache
   * @param data data of assigned item
   */
  releaseItem(data: AssignStatus): void {
    if (data.Path in this.assignedCache) {
      this.assignedCache[data.Path] = this.assignedCache[data.Path].filter(assign => assign.Item.Name !== data.Item.Name);
      if (this.assignedCache[data.Path].length === 0) {
        delete this.assignedCache[data.Path];
      }
    }
    this.releaseSource.next(data);
  }

  /**
   * Releases all cached assigned elements and notifies components
   */
  releaseAllItems(): void {
    Object.keys(this.assignedCache).forEach(path => {
      this.assignedCache[path].forEach((data: AssignStatus) => {
        this.releaseItem(data);
      });
    });
  }

  /**
   * Returns all cached assigned elements for given path
   * @param path path of the node to get assigned items of
   * @returns all cached assigned elements for given path
   */
  getAssignedItems(path: string): AssignStatus[] {
    return path in this.assignedCache ? this.assignedCache[path] : [];
  }

  /**
   * Gets all cached assigned item names for all nodes
   * @returns all cached assigned item names for all nodes
   */
  getAssignedItemNames(): string[] {
    const names = [];
    Object.keys(this.assignedCache).map(key => this.assignedCache[key]).forEach(items => items.forEach(item => names.push(item.Item.Name)));
    return names;
  }

  /**
   * Tests if at least one item can be assigned to node on given painted path
   * @param paintedPath painted path of the node to test
   * @param isCollapsible if the tested node can be collapsed or not
   * @returns true if at least one item can be assigned to given node
   */
  isAssignable(paintedPath: number[], isCollapsible: boolean): boolean {
    if (this.isDisabled) {
      return false;
    }

    if (Object.keys(this.assignedCache).length === 0) {
      return true;
    }

    if (isCollapsible) {
      paintedPath = paintedPath.slice();
      paintedPath.push(0);
    }

    for (const items of Object.keys(this.assignedCache).map(key => this.assignedCache[key])) {
      for (const item of items) {
        for (let i = 0; i < Math.min(paintedPath.length, item.PaintedPath.length) - 1; i++) {
          if (paintedPath[i] !== item.PaintedPath[i]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * After input data change this remove all assigns that cannot be applied anymore
   * @param validStructure new data structure
   * @param validNames new possible item names
   * @param filters new possible filters
   */
  clearInvalidAssigns(validStructure: DataStructure, validNames: string[], filters: { [id: string]: IsInputSchemaFilter[] }): void {
    const validPaths = [];

    function fetchValidPaths(structure: DataStructure) {
      validPaths.push(structure.Path);
      structure.Children.forEach(child => fetchValidPaths(child));
    }

    fetchValidPaths(validStructure);

    Object.keys(this.assignedCache)
      .filter(path => {
        if (validPaths.indexOf(path) === -1) {
          // invalid path
          return true;
        }
        for (const status of this.assignedCache[path]) {
          if (validNames.indexOf(status.Item.Name) === -1) {
            // invalid item name
            return true;
          }
        }

        return false;
      })
      .forEach(path => {
        this.assignedCache[path].forEach(status => this.releaseItem(status));
      });

    // remove invalid filters and reassign valid filters
    Object.keys(filters).forEach(path => {
      if (validPaths.indexOf(path) === -1) {
        this.applyFilter({Path: path, EmmitChange: false, Filters: []});
      } else {
        this.applyFilter({Path: path, EmmitChange: false, Filters: filters[path]});
      }
    });
  }

  /**
   * Sets disabled state and notifies components
   * @param val true for disabled, false for enabled
   */
  setDisabled(val: boolean): void {
    this.isDisabled = val;
    this.disabledSource.next(val);
  }
}
