import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-demo-bootstrap-switch',
  templateUrl: './demo-bootstrap-switch.component.html',
  styleUrls: ['./demo-bootstrap-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoBootstrapSwitchComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/master/package/is-bootstrap-switch-1.0.1.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsBootstrapSwitchModule } from 'is-bootstrap-switch';</pre>

<h3>Import Module with component defaults</h3>
<pre>import { IsBootstrapSwitchModule } from 'is-bootstrap-switch';

@NgModule({
  ...
  imports: [
    ...
    // configure defaults for component
    // labels can be translation keys (rendering goes through translate pipe)
    IsBootstrapSwitchModule.forRoot({ onText: 'bs-switch-on', offText: 'bs-switch-off' })
  ],
  ...
})</pre>

`;

  control1: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
    this.control1 = new FormControl();
    this.control1.setValue(true);
  }


  toggle(control: FormControl) {
    const val = control.value;
    control.setValue(!val);
  }


  disable(control: FormControl) {
    control.disabled ? control.enable() : control.disable();
  }



}
