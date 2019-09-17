import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AssignStatus } from './is-input-mapping.interface';

@Injectable()
export class IsInputMappingService {

  private assignSource = new Subject<AssignStatus>();
  private releaseSource = new Subject<AssignStatus>();
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
}
