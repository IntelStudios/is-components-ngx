import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IsTableColumn, IsTableRow } from 'projects/is-table/src/public_api';
@Component({
  selector: 'app-demo-table',
  templateUrl: './demo-table.component.html',
  styleUrls: ['./demo-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoTableComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-table-7.0.2.tgz
npm install --save ngx-bootstrap</pre>

<h3>Import Module</h3>
<pre>import { IsTableModule } from 'is-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  ...
  imports: [
    ...
    IsTableModule, PaginationModule.forRoot(),
  ],
  ...
})</pre>

`;

  columns: Array<IsTableColumn> = [
    { id: "Company", name: "Company", width: "50%", translate: true, align: 'left' },
    { id: "Name", name: "Name", width: "50%", translate: true, align: 'right' }
  ];

  searchItems: Array<string> = ['Company'];

  rows$: Observable<IsTableRow[]>;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  loadData() {
    setTimeout(() => {
      const rows: IsTableRow[] = [];

      for (var i = 20 - 1; i >= 0; i--) {
        rows.push(IsTableRow.deserialize({ ID: i, CanDisable: false,  IsActive: i % 7 !== 0, Data: {Company: `[danger_Company ${i}]`, Name: `Name ${13 * i}` }}));
      }

      this.rows$ = of(rows);

      this.changeDetector.markForCheck();
    });
  }
}
