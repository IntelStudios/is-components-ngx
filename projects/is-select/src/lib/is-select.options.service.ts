import { Injectable } from "@angular/core";
import { SelectItem } from "./select-item";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class IsSelectOptionsService {
  private signleValue$: Subject<SelectItem> = new BehaviorSubject(undefined);

  private activeOption$: Subject<SelectItem> = new BehaviorSubject(undefined);
  private _activeOption: SelectItem = undefined;

  get activeOption(): SelectItem {
    return this._activeOption;
  }

  setSingleValue(item: SelectItem | undefined) {
    this.signleValue$.next(item);
  }

  isSingleValueSelected(item: SelectItem): Observable<boolean> {
    return this.signleValue$.asObservable().pipe(
      map((i) => {
        if (!i) {
          return false;
        }
        return i.ID === item.ID;
      })
    );
  }

  setActiveOption(item: SelectItem | undefined) {
    this._activeOption = item;
    this.activeOption$.next(this.activeOption);
  }

  isActive(item: SelectItem): Observable<boolean> {
    return this.activeOption$.asObservable().pipe(
      map((i) => {
        if (i === undefined) {
          return false;
        }
        return i.ID === item.ID;
      })
    );
  }
}
