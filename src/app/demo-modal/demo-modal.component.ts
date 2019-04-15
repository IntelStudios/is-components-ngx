import { Component, TemplateRef, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IsModalComponent, IsModalConfig } from 'projects/is-modal/src/public_api';

@Component({
  selector: 'app-demo-modal',
  templateUrl: './demo-modal.component.html',
  styleUrls: ['./demo-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoModalComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<p>ngx-bootstrap peer dependency is required</p>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-modal-7.0.3.tgz
npm install --save ngx-bootstrap
</pre>

<h3>Import Module</h3>
<pre>import { IsModalModule } from 'is-modal';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  ...
  imports: [
    ...
    IsModalModule, ModalModule.forRoot()
  ],
  ...
})</pre>

`;


  @ViewChild('modalContent')
  template: TemplateRef<any>;

  constructor(private bsModalservice: BsModalService) { }

  ngOnInit() {
  }

  openDialog1() {
    const config: IsModalConfig = {
      template: this.template,
      buttonsRight: [
        {
          title: 'OK',
          buttonClass: 'btn-primary',
          onClick: () => {
            console.log('OK button click');
          }
        },
        {
          title: 'OK2',
          buttonClass: 'btn-primary'
        }
      ]
    };
    this.bsModalservice.show(IsModalComponent, { class: 'modal-sm', initialState: config });
  }

  openDialog2() {
    const config: IsModalConfig = {
      template: this.template,
    };
    this.bsModalservice.show(IsModalComponent, { class: 'modal-sm', initialState: config });
  }

  openModal(ref: TemplateRef<any>) {
    const config: IsModalConfig = {
      template: ref,
      title: 'Modal Title',
      buttonsLeft: [
        {
          title: 'Just a button',
          autoClose: false,
          onClick: () => {
            console.log('Just a button click');
          }
        },
        {
          title: 'Just a button 2',
          autoClose: false,
          onClick: () => {
            console.log('Just a button click');
          }
        }
      ],
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
