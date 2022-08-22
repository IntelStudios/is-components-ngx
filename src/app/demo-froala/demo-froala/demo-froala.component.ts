import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { IsFroalaService } from 'projects/is-froala/src/lib/is-froala.service';
import { IIsFroalaOptions, IsFroalaComponent } from 'projects/is-froala/src/public_api';
import { of } from 'rxjs';

@Component({
  selector: 'app-demo-froala',
  templateUrl: './demo-froala.component.html',
  styleUrls: ['./demo-froala.component.scss']
})
export class DemoFroalaComponent implements OnInit {


  usage: string = `

<h3>Installation</h3>
<pre>npm install --save @intelstudios/froala
npm install --save froala-editor at.js font-awesome tributejs</pre>

<h3>Import Module</h3>
<pre>import { IsFroalaModule } from '@intelstudios/froala';
  imports: [IsFroalaModule.forRoot({
    getLicense: () => {
      return 'your license key';
    },
    /* Optionally also set global froala theme selector */
    getTheme(): () => {
      return isDarkTheme ? 'dark' : null;
    }
  })

</pre>

<h3>Package Froala</h3>
<pre>
// add to styles.scss
@import '../node_modules/froala-editor/css/froala_editor.pkgd.min.css';
@import '../node_modules/froala-editor/css/froala_style.min.css';
@import '../node_modules/froala-editor/css/plugins/code_view.min.css';
@import '../node_modules/froala-editor/css/themes/dark.css'; // for dark theme
@import '../node_modules/at.js/dist/css/jquery.atwho.css';

@import '../node_modules/font-awesome/css/font-awesome.css';

// add to angular.json
"scripts": [
  "node_modules/jquery/dist/jquery.min.js",
  "node_modules/froala-editor/js/froala_editor.pkgd.min.js",
  "node_modules/froala-editor/js/plugins/code_view.min.js",
  "node_modules/at.js/dist/js/jquery.atwho.min.js",
  "node_modules/froala-editor/js/languages/cs.js",
  "node_modules/froala-editor/js/languages/de.js",
  "node_modules/froala-editor/js/languages/es.js",
  "node_modules/froala-editor/js/languages/fr.js",
  "node_modules/froala-editor/js/languages/hr.js",
  "node_modules/froala-editor/js/languages/hu.js",
  "node_modules/froala-editor/js/languages/nl.js",
  "node_modules/froala-editor/js/languages/pl.js",
  "node_modules/froala-editor/js/languages/pt_pt.js",
  "node_modules/froala-editor/js/languages/sk.js",
  "node_modules/froala-editor/js/languages/zh_cn.js",
  "node_modules/froala-editor/js/languages/zh_tw.js"
]

"styles": [
  "node_modules/tributejs/dist/tribute.css",
],
</pre>
  `

  readonly froalaTheme = document.body.classList.contains('is-theme-dark') ? 'dark' : null;

  froalaConfig: any = { id: 1, intellisense: of([{ Code: 'help', Label: 'Help me', Description: 'Help me' }]) };
  froalaConfigGerman = { id: 2 };

  @ViewChild('froalaTribute')
  froalaTribute: IsFroalaComponent;

  froalaConfigTribute: IIsFroalaOptions = {
    id: 1,
    placeholderText: 'Type @Test to lookup mentions',
    tributeOptions: {
      trigger: '@',
      lookup: 'name',
      fillAttr: 'name',
      values: (text: string, cb: (result: any[]) => void) => {
        console.log(`Tribute values callback: text ${text}`)
        if (!text || text.length < 2) {
          cb([]);
          return;
        }
        setTimeout(() => {
          console.log('Tribute values loaded (async)')
          cb([{ id: 11, name: 'Test 1' }, { id: 22, name: 'Test 2' }, { id: 33, name: 'Test 3' }])
        }, 200);
      },

      menuItemTemplate: function (item) {
        return `${item.original.id} ${item.original.name}`;
      },
      selectTemplate: function (item) {
        if (typeof item === 'undefined') return null;
        if (this.range.isContentEditable(this.current.element)) {
          return `<span data-user-id="${item.original.id}" style="color: #5b9bd1">@${item.original.name}</span>`;
        }
        return '@' + item.original.name;
      }
    }
  };


  control: FormControl = new FormControl();

  control1: FormControl = new FormControl();

  constructor(private froalaService: IsFroalaService) { }

  html = `<style>
	body {
		background: #7abdff !important;
	}
  </style>
  <p style="padding: 3px; border: 1px solid blue;">Hello how are you</p>
  <a href="https://is.xeelo.online" target="_blank">Link to click</a>
  <div style="width: 10px; height: 1500px"></div>
  <p style="padding: 3px; border: 1px solid blue;">I should be fine</p>`;

  ngOnInit() {
    this.control1.setValidators(Validators.required);
    this.control1.updateValueAndValidity();
  }

  loadContent() {
    this.control.setValue(this.html);
  }

  onFroalaCommand($event) {
    console.log($event);
  }

  closeHtmlEditor() {
    this.froalaService.executeRemoteCommand({ type: 'close-codeview' });
    console.log(this.control.value);
  }

  toggleDisabled() {
    if (this.control.enabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  toggleInvalid(ctrl: FormControl = this.control) {
    if (ctrl.errors) {
      ctrl.setErrors(null);
    } else {
      ctrl.setErrors({ invalid: true });
    }
  }

  printMentions() {
    const nodes = this.froalaTribute.editor.el.querySelectorAll('span[data-user-id]');
    nodes.forEach((node: ChildNode) => {
      const span: HTMLSpanElement = node as HTMLSpanElement;
      const val = span.attributes.getNamedItem('data-user-id').value;
      span.attributes.removeNamedItem('data-user-id');
      if (val) {
        console.log(`Mentioned ID: ${val}`);
      }
    });
  }

  enableCustomButtons() {
    this.froalaConfig = { id: this.froalaConfig.id++, intellisenseModal: true };
  }

  disableCustomButtons() {
    this.froalaConfig = { id: this.froalaConfig.id++, intellisenseModal: false };
  }
}
