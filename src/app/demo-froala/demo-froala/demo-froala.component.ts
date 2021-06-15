import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-demo-froala',
  templateUrl: './demo-froala.component.html',
  styleUrls: ['./demo-froala.component.scss']
})
export class DemoFroalaComponent implements OnInit {


  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-froala-7.0.6.tgz
npm install --save froala-editor at.js font-awesome</pre>

<h3>Import Module</h3>
<pre>import { IsFroalaModule } from 'is-froala';
  imports: [IsFroalaModule.forRoot({
    getLicense: () => {
      return 'your license key';
    }
  })

</pre>

<h3>Package Froala</h3>
<pre>
// add to styles.scss
@import '../node_modules/froala-editor/css/froala_editor.pkgd.min.css';
@import '../node_modules/froala-editor/css/froala_style.min.css';
@import '../node_modules/froala-editor/css/plugins/code_view.min.css';
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
]</pre>
  `

  froalaConfig: any = {id: 1};
  froalaConfigGerman = {id: 2, language: 'de'};

  control: FormControl = new FormControl();

  constructor(private sanitizer: DomSanitizer) { }

  html = `<style>
	body {
		background: #7abdff !important;
	}
  </style>
  <p style="padding: 3px; border: 1px solid blue;">Hello how are you</p>
  <div style="width: 10px; height: 1500px"></div>`;

  ngOnInit() {
    this.control.setValue(this.html);
  }


  onFroalaCommand($event) {
    console.log($event);
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
      ctrl.setErrors({invalid: true});
    }
  }

  enableCustomButtons() {
    this.froalaConfig = {id: this.froalaConfig.id++, intellisenseModal: true};
  }

  disableCustomButtons() {
   this.froalaConfig = {id: this.froalaConfig.id++, intellisenseModal: false};
  }
}
