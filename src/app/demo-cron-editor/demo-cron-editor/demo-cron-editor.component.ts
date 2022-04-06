import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { CronState } from 'projects/is-cron-editor/src/public_api';

@Component({
  selector: 'app-demo-cron-editor',
  templateUrl: './demo-cron-editor.component.html',
  styleUrls: ['./demo-cron-editor.component.scss']
})
export class DemoCronEditorComponent implements OnInit {
  usage = `

<h3>Installation</h3>
<pre>npm install --save @intelstudios/cron-editor</pre>

<h3>Import Module</h3>
<pre>import { IsCronEditorModule } from '@intelstudios/cron-editor';</pre>
`;

  cronControl = new FormControl();
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

  nullIt() {
    this.cronControl.setValue(null);
  }

  switchFixedState() {
    this.fixedState = this.fixedState ? undefined : {minutes: '0'};
  }
}
