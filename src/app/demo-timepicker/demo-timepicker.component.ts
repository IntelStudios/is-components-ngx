import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-timepicker',
  templateUrl: './demo-timepicker.component.html',
  styleUrls: ['./demo-timepicker.component.scss']
})
export class DemoTimepickerComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-timepicker-7.0.0.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsTimepickerModule } from 'is-timepicker';</pre>

  `


  constructor() { }

  ngOnInit(): void { }
}
