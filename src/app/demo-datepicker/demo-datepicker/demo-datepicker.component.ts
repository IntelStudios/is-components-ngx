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
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/8.x/package/is-datepicker-8.0.5.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsDatepickerModule } from 'is-datepicker';</pre>

  `

  control: FormControl;

  config: Partial<BsDatepickerConfig> = { minDate: new Date() };

  constructor() {
    this.control = new FormControl();
  }

  ngOnInit() {
  }

  onClearDate() {
    this.control.setValue(null);
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

}
