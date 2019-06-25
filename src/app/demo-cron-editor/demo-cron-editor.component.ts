import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {cronValidator} from '../../../projects/is-cron-editor/src/lib/is-cron-editor.validator';

@Component({
  selector: 'app-demo-cron-editor',
  templateUrl: './demo-cron-editor.component.html',
  styleUrls: ['./demo-cron-editor.component.scss']
})
export class DemoCronEditorComponent implements OnInit {
  usage = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-cron-editor-7.0.1.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsCronEditorModule } from 'is-cron-editor';</pre>
`;

  cronControl = new FormControl();

  constructor() {
  }

  ngOnInit() {
    this.cronControl.setValidators(cronValidator());
  }

  runOnChristmas() {
    this.cronControl.setValue('0 0 18 24 DEC ? *');
  }

  nullIt() {
    this.cronControl.setValue(null);
  }
}
