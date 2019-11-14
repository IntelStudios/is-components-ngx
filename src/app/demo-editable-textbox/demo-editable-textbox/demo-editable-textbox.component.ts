import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-demo-editable-textbox',
  templateUrl: './demo-editable-textbox.component.html',
  styleUrls: ['./demo-editable-textbox.component.scss']
})
export class DemoEditableTextboxComponent implements OnInit {

  usage = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-editable-textbox-7.2.0.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsEditableTextboxModule } from 'is-editable-textbox';</pre>`;

  control = new FormControl();

  constructor() {

  }

  ngOnInit() {
    this.control.setValue('Click on the pen here');
  }

  writeMyName() {
    setTimeout(() => this.control.setValue('My name'));
  }

  makeInvalid() {
    this.control.setErrors({ 'this is just wrong': true });
  }
}
