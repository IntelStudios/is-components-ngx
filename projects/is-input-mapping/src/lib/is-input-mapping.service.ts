import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AssignStatus, DataStructure } from './is-input-mapping.interface';

@Injectable()
export class IsInputMappingService {

  private assignSource = new Subject<AssignStatus>();
  private releaseSource = new Subject<AssignStatus>();
  /*
  key: path of item that has assigns
  value: list of assigned AssignStatus
   */
  private assignedCache = {};

  itemAssigned$ = this.assignSource.asObservable();
  itemReleased$ = this.releaseSource.asObservable();

  assignItem(data: AssignStatus) {
    this.assignSource.next(data);
    if (!(data.Path in this.assignedCache)) {
      this.assignedCache[data.Path] = [];
    }
    this.assignedCache[data.Path].push(data);
  }

  releaseItem(data: AssignStatus) {
    this.releaseSource.next(data);
    if (data.Path in this.assignedCache) {
      this.assignedCache[data.Path] = this.assignedCache[data.Path].filter(assign => assign.Item.Name !== data.Item.Name);
      if (this.assignedCache[data.Path].length === 0) {
        delete this.assignedCache[data.Path];
      }
    }
  }

  getAssignedItems(path: string): AssignStatus[] {
    return path in this.assignedCache ? this.assignedCache[path] : [];
  }

  getAssignedItemNames(): string[] {
    const names = [];
    Object.keys(this.assignedCache).map(key => this.assignedCache[key]).forEach(items => items.forEach(item => names.push(item.Item.Name)));
    return names;
  }

  isAssignable(paintedPath: number[]): boolean {
    if (Object.keys(this.assignedCache).length === 0) {
      return true;
    }
    const assignedItem: AssignStatus = this.assignedCache[Object.keys(this.assignedCache)[0]][0];
    return paintedPath[0] === assignedItem.PaintedPath[0];
  }

  clearInvalidAssigns(validStructure: DataStructure) {
    const validPaths = [];

    function fetchValidPaths(structure: DataStructure) {
      validPaths.push(structure.Path);
      structure.Children.forEach(child => fetchValidPaths(child));
    }

    fetchValidPaths(validStructure);

    Object.keys(this.assignedCache).filter(path => validPaths.indexOf(path) === -1).forEach(path => {
      this.assignedCache[path].forEach(status => this.releaseItem(status));
    });
  }
}
