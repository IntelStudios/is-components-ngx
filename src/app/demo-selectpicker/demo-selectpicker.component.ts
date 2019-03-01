import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, of, timer } from 'rxjs';

@Component({
  selector: 'app-demo-selectpicker',
  templateUrl: './demo-selectpicker.component.html',
  styleUrls: ['./demo-selectpicker.component.scss']
})
export class DemoSelectpickerComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/master/package/is-selectpicker-1.0.2.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsSelectpickerModule } from 'is-selectpicker';</pre>
`

  control1: FormControl;
  control2: FormControl;

  constructor() { }

  ngOnInit() {
    this.control1 = new FormControl();
    this.control1.setValue(['A','B','C']);

    this.control2 = new FormControl();
  }

  options: any[] = [
    { ID: 1, Value: 'Value 1' },
    { ID: 2, Value: 'Value 2' },
    { ID: 3, Value: 'Value 3' }
  ];

  moreOptions: any[] = [
    { ID: 1, Value: 'Value 1' },
    { ID: 2, Value: 'Value 2' },
    { ID: 3, Value: 'Value 3' },
    { ID: 4, Value: 'Value 4' },
    { ID: 5, Value: 'Value 5' },
    { ID: 6, Value: 'Value 6' },
  ];

  options$: Observable<any[]>;

  loadOptions() {
    this.options$ = of([
    { ID: 'A', Value: 'Value A' },
    { ID: 'B', Value: 'Value B' },
    { ID: 'C', Value: 'Value C' },
    { ID: 'D', Value: 'Value D' }
  ]);
  }

  moreOptions$: Observable<any[]>;

  onOptionsRequired() {
    this.moreOptions$ = new Observable((observer) => {
      setTimeout(() => {
      observer.next([
          {ID: 1, Value: 'Value 1'},
          {ID: 2, Value: 'Value 2'},
          {ID: 3, Value: 'Value 3'},
          {ID: 4, Value: 'Value 4'},
          {ID: 5, Value: 'Value 5'},
          {ID: 6, Value: 'Value 6'},
        ]);
        observer.complete();
      }, 2000);
    });
  }
}
