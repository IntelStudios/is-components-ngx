import { Component, TemplateRef, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IsModalMovableService } from 'projects/is-modal/src/lib/is-modal-movable.service';
import { IsModalComponent, IsModalConfig, IsModalMovableConfig, IsModalRef, IsModalMovableRef } from 'projects/is-modal/src/public_api';
import { DemoModalMovableComponent } from './demo-modal-movable.component';

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
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/8.x/package/is-modal-8.0.0.tgz
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


  @ViewChild('modalContent', { static: true })
  template: TemplateRef<any>;

  modalMovableRef: IsModalMovableRef;

  constructor(private bsModalservice: BsModalService, private movableService: IsModalMovableService) { }

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

  openMovableComponentModal() {
    if (!this.modalMovableRef || (this.modalMovableRef && this.modalMovableRef.closed)) {
      this.modalMovableRef = this.movableService.showComponent(DemoModalMovableComponent, { template: null }, { title: 'Test Movable Title', close: 'Close', save: 'Save' });
    }
  }

  openMovableModal(ref: TemplateRef<any>) {
    const config: IsModalMovableConfig = {
      template: ref,
      title: 'Modal Title',
      cssClass: 'modal-lg',
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
          onClick: (modal: IsModalRef) => {
            console.log('Just a button click - close with modal ref');
            modal.close();
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

    if (!this.modalMovableRef || (this.modalMovableRef && this.modalMovableRef.closed)) {
      this.modalMovableRef = this.movableService.show(config);
    }
  }

  closeMovableModal() {
    if (this.modalMovableRef) {
      this.modalMovableRef.close();
    }
  }
}
