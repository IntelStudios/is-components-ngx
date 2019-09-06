import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AssignStatus } from './is-input-mapping.interface';

@Injectable()
export class IsInputMappingService {

  private assignSource = new Subject<AssignStatus>();
  private releaseSource = new Subject<AssignStatus>();

  itemAssigned$ = this.assignSource.asObservable();
  itemReleased$ = this.releaseSource.asObservable();

  assignItem(data: AssignStatus) {
    this.assignSource.next(data);
  }

  releaseItem(data: AssignStatus) {
    this.releaseSource.next(data);
  }
}
