import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-datepicker',
  templateUrl: './demo-datepicker.component.html',
  styleUrls: ['./demo-datepicker.component.scss']
})
export class DemoDatepickerComponent implements OnInit {


  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/master/package/is-datepicker-1.0.1.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsDatepickerModule } from 'is-datepicker';</pre>

  `


  constructor() { }

  ngOnInit() {
  }

}
