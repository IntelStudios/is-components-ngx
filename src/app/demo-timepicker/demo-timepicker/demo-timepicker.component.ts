import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-demo-timepicker',
  templateUrl: './demo-timepicker.component.html',
  styleUrls: ['./demo-timepicker.component.scss']
})
export class DemoTimepickerComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save @intelstudios/timepicker</pre>

<h3>Import Module</h3>
<pre>import { IsTimepickerModule } from 'is-timepicker';</pre>

  `

  small = false;
  timepickerControl: UntypedFormControl;
  timepickerControl1: UntypedFormControl;
  timepickerControl2: UntypedFormControl;
  timepickerControl3: UntypedFormControl;

  constructor() {
    this.timepickerControl = new UntypedFormControl();
    this.timepickerControl1 = new UntypedFormControl('12:00:00');
    this.timepickerControl2 = new UntypedFormControl();
    this.timepickerControl3 = new UntypedFormControl();
    this.timepickerControl3.setValidators(Validators.required);
    this.timepickerControl3.updateValueAndValidity();
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
