import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { of } from 'rxjs';

import { FieldErrorService, FieldErrorModel } from '../../../projects/is-metronic/src/public_api';

@Component({
  selector: 'app-demo-metronic',
  templateUrl: './demo-metronic.component.html',
  styleUrls: ['./demo-metronic.component.scss']
})
export class DemoMetronicComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/master/package/is-metronic-1.1.5.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsMetronicModule } from 'is-metronic';</pre>

<h3>Import Styles</h3>
<pre>
// add Metronic styles
@import 'assets/metronic/admin/layout/css/layout.css';
@import 'assets/metronic/admin/layout/css/custom.css';
@import 'assets/metronic/admin/layout/css/themes/darkblue.css';
@import 'assets/metronic/admin/pages/css/profile.css';
@import 'assets/metronic/global/css/components-rounded.css';
@import 'assets/metronic/global/css/plugins.css';
@import 'assets/metronic/admin/layout/css/layout.css';</pre>
  `

  hint: string = `
    <p>Text</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  `

  formControl1: FormControl;
  formControl2: FormControl;

  constructor() {
    this.formControl1 = new FormControl();
    this.formControl2 = new FormControl();

    let inputRequiredValidator = (control: AbstractControl) => {
      let invalid = FieldErrorService.requiredError();
      return control.value !== '' ? of(null) : of(invalid);
    };

    this.formControl1.setAsyncValidators(inputRequiredValidator);

    let customValidator = (control: AbstractControl) => {
      let invalid = {
        custom: new FieldErrorModel('custom', false).setPriority(10).withMessage('This is custom validator, input does not contain word "custom"')
      };

      if (control.value && control.value.indexOf('custom') > -1) {
        return of(null);
      } else {
        return of(invalid);
      }
    }

    this.formControl2.setAsyncValidators(customValidator);
  }

  ngOnInit() {
  }

}
