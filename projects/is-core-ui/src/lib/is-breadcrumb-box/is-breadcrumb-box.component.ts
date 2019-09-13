import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IBreadcrumb } from './is-breadcrumb-box.interface';

@Component({
  selector: 'is-breadcrumb-box',
  templateUrl: './is-breadcrumb-box.component.html',
  styleUrls: ['./is-breadcrumb-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsBreadcrumbBoxComponent {

  @Input()
  bgClass: string = 'bg-blue-hoki';

  @Input()
  count: number = null;

  @Input()
  set breadcrumb(bread: IBreadcrumb) {
    this._breadcrumb = bread;
    if (bread && bread.route) {
      this.route = [...bread.route]
      if (this._breadcrumb.start) {
        this.route[0] = `./${this.route[0]}`;
      }
    }
  }
  get breadcrumb(): IBreadcrumb {
    return this._breadcrumb;
  }
  private _breadcrumb: IBreadcrumb;

  route: any[];

  constructor() { }

}
