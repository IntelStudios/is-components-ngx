import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-selectpicker',
  templateUrl: './demo-selectpicker.component.html',
  styleUrls: ['./demo-selectpicker.component.scss']
})
export class DemoSelectpickerComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/metronic_v5/package/is-selectpicker-2.0.1.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsSelectpickerModule } from 'is-selectpicker';</pre>
`

  constructor() { }

  ngOnInit() {
  }

  options: any[] = [
    {ID: 1, Value: 'Value 1'},
    {ID: 2, Value: 'Value 2'},
    {ID: 3, Value: 'Value 3'}
  ];

  moreOptions: any[] = [
    {ID: 1, Value: 'Value 1'},
    {ID: 2, Value: 'Value 2'},
    {ID: 3, Value: 'Value 3'},
    {ID: 4, Value: 'Value 4'},
    {ID: 5, Value: 'Value 5'},
    {ID: 6, Value: 'Value 6'},
  ];

}
