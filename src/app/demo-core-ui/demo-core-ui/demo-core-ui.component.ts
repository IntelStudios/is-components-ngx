import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { IsFieldError, IsFieldErrorFactory } from '@intelstudios/cdk';
import { of } from 'rxjs';


@Component({
  selector: 'app-demo-core-ui',
  templateUrl: './demo-core-ui.component.html',
  styleUrls: ['./demo-core-ui.component.scss']
})
export class DemoCoreUIComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save @intelstudios/core-ui</pre>

<h3>Import Module</h3>
<pre>import { IsCoreUIModule } from '@intelstudios/core-ui';</pre>

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

  encapsulatedHtml1 = `
  <style>body 
  
  { color: red;}
  div {
    width: 100px;
    height: 100px;
    background: red;
    position: relative;
    animation: mymove 5s infinite;
    }
    
    @keyframes mymove {
    0% {left: 0px;}
    25% {left: 200px;}
    75% {left: 50px}
    100% {left: 100px;}
    }

  <!--
    /* Font Definitions */
    
    @font-face {
        font-family: "Cambria Math";
        panose-1: 2 4 5 3 5 4 6 3 2 4;
    }
    
    @font-face {
        font-family: Calibri;
        panose-1: 2 15 5 2 2 2 4 3 2 4;
    }
    /* Style Definitions */
    
    p.MsoNormal,
    li.MsoNormal,
    div.MsoNormal {
        margin: 0cm;
        font-size: 11.0pt;
        font-family: "Calibri", sans-serif;
        mso-ligatures: standardcontextual;
    }
    
    span.EmailStyle17 {
        mso-style-type: personal-compose;
        font-family: "Calibri", sans-serif;
        color: windowtext;
    }
    
    .MsoChpDefault {
        mso-style-type: export-only;
        font-family: "Calibri", sans-serif;
        mso-ligatures: standardcontextual;
    }
    
    @page WordSection1 {
        size: 612.0pt 792.0pt;
        margin: 72.0pt 72.0pt 72.0pt 72.0pt;
    }
    
    div.WordSection1 {
        page: WordSection1;
    }
    
    -->
  </style>
  <h3>Encapsulated HTML 1</h3>
<pre>npm install --save @intelstudios/core-ui</pre>
<div></div>
<script src="https://www.gstatic.com/charts/loader.js"></script>
<script>
async function fn() {
  await Promise.resolve();
  console.log('is-encapsulated: async function executed');
}
fn();
</script>
  `;

  encapsulatedHtml2 = `
  <style>pre { color: blue;}</style>
  <h3>Encapsulated HTML 2</h3>
<pre>npm install --save @intelstudios/core-ui</pre>
  `;

  encapsulatedHtml3 = `
  <style>pre { color blue;}</style>
  <h3>Encapsulated HTML (CSS Error)</h3>
<pre>npm install --save @intelstudios/core-ui</pre>
  `;

  small = false;

  formControl1: FormControl;
  formControl2: FormControl;
  formControl3: FormControl;
  formControl4: FormControl;
  formControl5: FormControl;
  passwordControl: FormControl;
  checkboxControl: FormControl = new FormControl();
  checkboxIndeterminate = false;
  radioGroupControl: FormControl = new FormControl();
  switchControl: FormControl = new FormControl();

  tabValid = true;

  public selectItems: Array<string> = ['Amsterdam', 'Nové Město za devatero řekami a desatero horami a jedenáctero černými lesy', 'Antwerp', 'Athens', 'Barcelona',
    'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
    'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
    'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
    'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
    'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
    'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
    'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
    'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
    'Zagreb', 'Zaragoza', 'Łódź'];

  constructor() {
    this.formControl1 = new FormControl();
    this.formControl2 = new FormControl();
    this.formControl3 = new FormControl();
    this.formControl3.setValidators([Validators.required, Validators.min(10), Validators.max(100)]);
    this.formControl3.updateValueAndValidity();
    this.formControl4 = new FormControl();
    this.formControl4.setValidators(Validators.minLength(3));
    this.formControl4.updateValueAndValidity();
    this.formControl5 = new FormControl();
    this.formControl5.setValidators(Validators.required);
    this.formControl5.updateValueAndValidity();

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
    this.formControl5.setAsyncValidators(customValidator);
  }

  ngOnInit() {
  }

  toggleInvalid(ctrl: FormControl) {
    if (ctrl.valid) {
      ctrl.setErrors({ invalid: true })
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

  toggleSwitchValue() {
    const val = this.switchControl.value;
    this.switchControl.setValue(!val);
  }
}
