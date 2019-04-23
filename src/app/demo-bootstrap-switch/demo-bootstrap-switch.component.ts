import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IsModalConfig, IsModalComponent } from 'projects/is-modal/src/public_api';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-demo-bootstrap-switch',
  templateUrl: './demo-bootstrap-switch.component.html',
  styleUrls: ['./demo-bootstrap-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoBootstrapSwitchComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-bootstrap-switch-7.0.0.tgz</pre>

<h3>Import Styles</h3>
<pre>https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.2/css/bootstrap3/bootstrap-switch.css</pre>

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
  control2: FormControl = new FormControl();

  constructor(private bsModalservice: BsModalService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.control1 = new FormControl();
    this.control1.setValue(false);
  }

  toggle(control: FormControl) {
    const val = control.value;
    control.setValue(!val);
  }

  disable(control: FormControl) {
    control.disabled ? control.enable() : control.disable();
  }

  openModal(ref: TemplateRef<any>) {
    const config: IsModalConfig = {
      template: ref,
      title: 'Modal Title',
      buttonsRight: [
        {
          title: 'OK',
          icon: 'fa fa-check',
          buttonClass: 'btn-primary',
          onClick: () => {
            console.log('OK button click');
          }
        },
        {
          title: 'OK 2',
          icon: 'fa fa-check',
          buttonClass: 'btn-danger',
          onClick: () => {
            console.log('OK 2 button click');
          }
        }
      ]
    };

    this.bsModalservice.show(IsModalComponent, { class: 'modal-lg', initialState: config });
  }
}
