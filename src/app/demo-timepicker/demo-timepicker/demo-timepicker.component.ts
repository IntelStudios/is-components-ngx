import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-demo-timepicker',
  templateUrl: './demo-timepicker.component.html',
  styleUrls: ['./demo-timepicker.component.scss']
})
export class DemoTimepickerComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/8.x/package/is-timepicker-8.0.7.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsTimepickerModule } from 'is-timepicker';</pre>

  `

  timepickerControl: FormControl;
  timepickerControl1: FormControl;
  timepickerControl2: FormControl;

  constructor() {
    this.timepickerControl = new FormControl();
    this.timepickerControl1 = new FormControl();
    this.timepickerControl2 = new FormControl();
  }

  ngOnInit() {
    this.timepickerControl.valueChanges.subscribe(item=> {
      console.log('change :', item, typeof item);
    });

    this.timepickerControl2.setValue('03:00:00');
    this.timepickerControl2.disable();
  }

  setValue() {
    this.timepickerControl1.setValue('02:00:00');
  }

  disableToggle() {
    this.timepickerControl1.enabled ? this.timepickerControl1.disable() : this.timepickerControl1.enable();
  }
}
