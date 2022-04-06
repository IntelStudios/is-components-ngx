import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-demo-datepicker',
  templateUrl: './demo-datepicker.component.html',
  styleUrls: ['./demo-datepicker.component.scss']
})
export class DemoDatepickerComponent implements OnInit {


  usage: string = `

<h3>Installation</h3>
<pre>npm install --save @intelstudios/datepicker</pre>

<h3>Import Module</h3>
<pre>import { IsDatepickerModule } from '@intelstudios/datepicker';</pre>

  `

  small = false;
  control: FormControl = new FormControl();

  control2: FormControl = new FormControl();

  control3: FormControl = new FormControl();

  control4: FormControl = new FormControl();

  config: Partial<BsDatepickerConfig> = { minDate: new Date() };

  readonly = false;

  constructor() {
  }

  ngOnInit() {
    this.control4.setValidators(Validators.required);
    this.control4.updateValueAndValidity();
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
    if (ctrl === this.control3) {
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
