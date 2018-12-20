import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IsGridModelCell } from '../is-grid.interfaces';
@Component({
  selector: 'is-grid-row',
  templateUrl: './is-grid-row.component.html',
  styleUrls: ['./is-grid-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsGridRowComponent implements OnInit {

  @Input()
  gm: IsGridModelCell;

  @Input()
  row: any;

  constructor() { }

  ngOnInit() {
  }

}
