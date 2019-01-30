import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IsGridModel, IsGridDataRow } from 'projects/is-grid/src/public_api';
@Component({
  selector: 'app-demo-grid',
  templateUrl: './demo-grid.component.html',
  styleUrls: ['./demo-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoGridComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/master/package/is-grid-1.0.3.tgz
npm install --save ngx-bootstrap</pre>

<h3>Import Module</h3>
<pre>import { IsGridModule } from 'is-grid';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  ...
  imports: [
    ...
    IsGridModule, PaginationModule.forRoot(),
  ],
  ...
})</pre>

`;

  gridModel: IsGridModel = IsGridModel.deserialize(
    [
      {
        Name: 'Title',
        Width: 12, Position: 1, Row: 1, ColumnName: 'COL1_TITLE', IsTitle: true, ProcessValue: false
      },
      {
        Name: 'Value',
        Width: 12, Position: 1, Row: 2, ColumnName: 'COL1_Value', IsTitle: false, ProcessValue: false
      },
    ]
  );

  rows$: Observable<IsGridDataRow[]>;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  loadData() {
    setTimeout(() => {
      const rows: IsGridDataRow[] = [];

      for (var i = 20 - 1; i >= 0; i--) {
        const r = IsGridDataRow.deserialize({
          ID: i,
          COL1_TITLE: 'Row title',
          COL1_Value: 'Row value'
        });
        rows.push(r);
      }

      rows.push(IsGridDataRow.deserialize({
        ID: 999,
        COL1_TITLE: 'Row title',
        COL1_Value: 'Row value (disabled)',
        COLOR: 'disabled'
      }));
      this.rows$ = of(rows);

      this.changeDetector.markForCheck();
    });
  }

}
