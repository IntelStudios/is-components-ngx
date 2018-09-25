import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-froala',
  templateUrl: './demo-froala.component.html',
  styleUrls: ['./demo-froala.component.scss']
})
export class DemoFroalaComponent implements OnInit {


  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/master/package/is-froala-1.0.1.tgz
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

@import '../node_modules/font-awesome/css/font-awesome.css';

// add to angular.json
"scripts": [
  "node_modules/jquery/dist/jquery.min.js",
  "node_modules/froala-editor/js/froala_editor.pkgd.min.js",
  "node_modules/froala-editor/js/plugins/code_view.min.js",
  "node_modules/at.js/dist/js/jquery.atwho.min.js"
]</pre>
  `

  froalaConfig: any = {id: 1};

  constructor() { }

  ngOnInit() {
  }

  onFroalaCommand($event) {
    console.log($event);
  }

  enableCustomButtons() {
    this.froalaConfig = {id: this.froalaConfig.id++, intellisenseModal: true};
  }

  disableCustomButtons() {
   this.froalaConfig = {id: this.froalaConfig.id++, intellisenseModal: false};
  }
}
