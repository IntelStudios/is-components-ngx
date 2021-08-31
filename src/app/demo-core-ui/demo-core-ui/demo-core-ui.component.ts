import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { of } from 'rxjs';

import { IsFieldError, IsFieldErrorFactory } from 'projects/is-core-ui/src/public_api';

@Component({
  selector: 'app-demo-core-ui',
  templateUrl: './demo-core-ui.component.html',
  styleUrls: ['./demo-core-ui.component.scss']
})
export class DemoCoreUIComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/8.x/package/is-core-ui-8.1.6.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsCoreUIModule } from 'is-core-ui';</pre>

<h3>Import Styles</h3>
<pre>


// import IS variables
@import ~is/metronic/scss/variables;
@import ~is/metronic/scss/mixins;
  `;

  hint: string = `
    <p>Text</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  `;

  formControl1: FormControl;
  formControl2: FormControl;
  passwordControl: FormControl;
  checkboxControl: FormControl = new FormControl();
  checkboxIndeterminate = false;
  radioGroupControl: FormControl = new FormControl();

  tabValid = true;

  constructor() {
    this.formControl1 = new FormControl();
    this.formControl2 = new FormControl();
    this.passwordControl = new FormControl();

    let inputRequiredValidator = (control: AbstractControl) => {
      let invalid = IsFieldErrorFactory.requiredError();
      return control.value !== '' ? of(null) : of(invalid);
    };

    this.formControl1.setAsyncValidators(inputRequiredValidator);

    let customValidator = (control: AbstractControl) => {
      let invalid = {
        custom: new IsFieldError('custom', false).withPriority(10).withMessage('This is custom validator, input does not contain word "custom"')
      };

      if (control.value && control.value.indexOf('custom') > -1) {
        return of(null);
      } else {
        return of(invalid);
      }
    };

    this.formControl2.setAsyncValidators(customValidator);
  }

  ngOnInit() {
  }

  toggleInvalid(ctrl: FormControl) {
    if (ctrl.valid) {
      ctrl.setErrors({invalid: true})
    } else {
      ctrl.setErrors(null);
    }
  }

  toggleDisabled(ctrl: FormControl) {
    if (ctrl.enabled) {
      ctrl.disable();
    } else {
      ctrl.enable();
    }
  }

  toggleCheckboxValue() {
    const val = this.checkboxControl.value;
    this.checkboxControl.setValue(!val);
  }

  intermediateCheckboxValue() {
    this.checkboxIndeterminate = !this.checkboxIndeterminate;
  }

  toggleRadioValue() {
    const val = this.radioGroupControl.value;
    this.radioGroupControl.setValue(val === '1' ? '2' : '1');
  }
}
