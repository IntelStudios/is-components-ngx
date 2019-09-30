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
    if (!(data.Path in this.assignedCache)) {
      this.assignedCache[data.Path] = [];
    }
    this.assignedCache[data.Path].push(data);
    this.assignSource.next(data);
  }

  releaseItem(data: AssignStatus) {
    if (data.Path in this.assignedCache) {
      this.assignedCache[data.Path] = this.assignedCache[data.Path].filter(assign => assign.Item.Name !== data.Item.Name);
      if (this.assignedCache[data.Path].length === 0) {
        delete this.assignedCache[data.Path];
      }
    }
    this.releaseSource.next(data);
  }

  getAssignedItems(path: string): AssignStatus[] {
    return path in this.assignedCache ? this.assignedCache[path] : [];
  }

  getAssignedItemNames(): string[] {
    const names = [];
    Object.keys(this.assignedCache).map(key => this.assignedCache[key]).forEach(items => items.forEach(item => names.push(item.Item.Name)));
    return names;
  }

  isAssignable(paintedPath: number[], isCollapsible: boolean): boolean {
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
