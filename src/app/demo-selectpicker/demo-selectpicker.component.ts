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
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-selectpicker-7.1.7.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsSelectpickerModule } from 'is-selectpicker';</pre>
`

  control1: FormControl;
  control2: FormControl;
  controlBadges: FormControl;

  constructor() { }

  ngOnInit() {
    this.control1 = new FormControl();
    this.control1.setValue(['A','B','C']);

    this.control2 = new FormControl();

    this.controlBadges = new FormControl();
    this.controlBadges.setValue([{ ID: 1, Value: '1 - [Danger_Value 1]' }, { ID: 3, Value: '3 - [Info_Value 3]' }]);
  }

  options: any[] = [
    { ID: 1, Value: 'Value 1' },
    { ID: 2, Value: 'Value 2' },
    { ID: 3, Value: 'Value 3' },
    { ID: 4, Value: 'Value 4' },
    { ID: 5, Value: 'Value 5' },
    { ID: 6, Value: 'Value 6' },
    { ID: 7, Value: 'Value 7' },
    { ID: 8, Value: 'Value 8' },
    { ID: 9, Value: 'Value 9' }
  ];

  moreOptions: any[] = [
    { ID: 1, Value: 'Value 1' },
    { ID: 2, Value: 'Value 2' },
    { ID: 3, Value: 'Value 3' },
    { ID: 4, Value: 'Value 4' },
    { ID: 5, Value: 'Value 5' },
    { ID: 6, Value: 'Value 6' },
  ];

  optionsBadges: any[] = [
    { ID: 1, Value: '1 - [Danger_Value 1]' },
    { ID: 2, Value: '2 - [Warning_Value 2]' },
    { ID: 3, Value: '3 - [Info_Value 3]' },
    { ID: 4, Value: '1 - [Danger_Value 1]' },
    { ID: 5, Value: '2 - [Warning_Value 2]' },
    { ID: 6, Value: '3 - [Info_Value 3]' },
    { ID: 7, Value: '1 - [Danger_Value 1]' },
    { ID: 8, Value: '2 - [Warning_Value 2]' },
    { ID: 9, Value: '3 - [Info_Value 3]' }
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

  badgeChange($event) {
    console.log('change', $event);
  }

  moreOptions$: Observable<any[]>;

  onOptionsRequired($event: any) {

    if ($event == null) {
      console.log('Should cancel loading');
      return;
    }
    console.log(`Loading options filter=${$event}`);
    this.moreOptions$ = new Observable((observer) => {
      setTimeout(() => {
      observer.next([
          {ID: 1, Value: 'aaaaa'},
          {ID: 2, Value: 'aaaab'},
          {ID: 3, Value: 'aaaac'},
          {ID: 4, Value: 'aaaad'},
          {ID: 5, Value: 'aaaba'},
          {ID: 6, Value: 'aaabb'},
        ]);

      }, 1000);
    });
  }
}
