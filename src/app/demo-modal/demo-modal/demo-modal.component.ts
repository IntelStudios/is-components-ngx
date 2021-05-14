import { Component, TemplateRef, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IsModalMovableService } from 'projects/is-modal/src/lib/is-modal-movable.service';
import { IsModalConfig, IsModalMovableConfig, IsModalRef, IsModalMovableRef, IsModalService } from 'projects/is-modal/src/public_api';
import { Observable, of } from 'rxjs';
import { delay, map, mergeMap, switchMap, tap } from 'rxjs/operators';
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
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/8.x/package/is-modal-8.0.2.tgz
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

  largeContent$: Observable<string> = of('x')
    .pipe(
      delay(1000),
      map(() => {
        return `<p>${this.usage}${this.usage}${this.usage}${this.usage}${this.usage}${this.usage}</p>`;
      }),
      tap(() => {
        setTimeout(() => {
          if (this.modalMovableRef) {
            this.modalMovableRef.center();
          }
        });
      }),
    )

  constructor(private modalService: IsModalService, private movableService: IsModalMovableService) { }

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
      ],
      options: { class: 'modal-sm' }
    };
    this.modalService.show(config);
  }

  openDialog2() {
    const config: IsModalConfig = {
      template: this.template,
      options: { class: 'modal-sm' },
    };
    this.modalService.show(config);
  }

  openModal(ref: TemplateRef<any>) {
    const config: IsModalConfig = {
      template: ref,
      title: 'Modal Title',
      bodyScroll: true,
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
      ],
      options: { class: 'modal-lg' },
    };

    this.modalService.show(config);
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
