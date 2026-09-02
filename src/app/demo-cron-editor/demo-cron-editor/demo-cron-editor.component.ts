import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { CronState, IsCronEditorComponent } from 'projects/is-cron-editor/src/public_api';

@Component({
    selector: 'app-demo-cron-editor',
    templateUrl: './demo-cron-editor.component.html',
    styleUrls: ['./demo-cron-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ReactiveFormsModule, JsonPipe, IsCronEditorComponent],
})
export class DemoCronEditorComponent implements OnInit {
  usage = `

<h3>Installation</h3>
<pre>npm install --save @intelstudios/cron-editor</pre>

<h3>Provide in application config</h3>
<pre>import { provideIsCronEditor } from '@intelstudios/cron-editor';
providers: [provideIsCronEditor()]</pre>
`;

  cronControl = new UntypedFormControl();
  randomExtensionSwitch = false;

  fixedState?: CronState = undefined;

  constructor() {
  }

  ngOnInit() {
    this.cronControl.setValidators(Validators.required);
    this.runOnChristmas();
  }

  runOnChristmas() {
    this.cronControl.setValue('0 0 18 24 DEC ? *');
  }

  setSomething() {
    setTimeout(() => {
      this.cronControl.setValue('0 0 * ? * * *');
    }, 100);
  }

  nullIt() {
    this.cronControl.setValue(null);
  }

  switchFixedState() {
    this.fixedState = this.fixedState ? undefined : { minutes: '0' };
  }
}
