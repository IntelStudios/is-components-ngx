import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-demo-datepicker',
  templateUrl: './demo-datepicker.component.html',
  styleUrls: ['./demo-datepicker.component.scss']
})
export class DemoDatepickerComponent implements OnInit {


  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/9.x/package/is-datepicker-9.0.4.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsDatepickerModule } from 'is-datepicker';</pre>

  `

  control: FormControl;

  control2: FormControl = new FormControl();

  config: Partial<BsDatepickerConfig> = { minDate: new Date() };

  readonly = false;

  constructor() {
    this.control = new FormControl();
  }

  ngOnInit() {
  }

  onClearDate() {
    this.control.setValue(null);
  }

  setTomorrow(ctrl: FormControl) {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    if (ctrl === this.control) {
      ctrl.setValue(now);
    }
    if (ctrl === this.control2) {
      ctrl.setValue(`${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`);
    }
  }

  toggleInvalid(ctrl: FormControl = this.control) {
    if (ctrl.errors) {
      ctrl.setErrors(null);
    } else {
      ctrl.setErrors({ invalid: true });
    }
  }

  toggleDisabled() {
    this.control.disabled ? this.control.enable() : this.control.disable();
  }

  toggleReadOnly() {
    this.readonly = !this.readonly;
  }
}
