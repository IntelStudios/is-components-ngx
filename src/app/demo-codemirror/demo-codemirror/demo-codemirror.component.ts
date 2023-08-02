import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-codemirror',
  templateUrl: './demo-codemirror.component.html',
  styleUrls: ['./demo-codemirror.component.scss']
})
export class DemoCodemirrorComponent implements OnInit {


  usage: string = `

<h3>Installation</h3>
<pre>npm install --save @intelstudios/codemirror
npm install --save codemirror</pre>

<h3>Import Module</h3>
<pre>import { IsCodemirrorModule } from '@intelstudios/codemirror';</pre>

<h3>Package CodeMirror</h3>
<pre>
// add to styles.scss
@import '../node_modules/codemirror/lib/codemirror.css';
@import '../node_modules/codemirror/addon/hint/show-hint.css';
@import '../node_modules/codemirror/addon/lint/lint.css';

// add to angular.json
"scripts": [
  "node_modules/codemirror/lib/codemirror.js",
  "node_modules/codemirror/mode/sql/sql.js",
  "node_modules/codemirror/mode/javascript/javascript.js",
  "node_modules/codemirror/mode/powershell/powershell.js",
  "node_modules/codemirror/mode/xml/xml.js"
  "node_modules/codemirror/addon/hint/show-hint.js",
  "node_modules/codemirror/addon/hint/javascript-hint.js",
]</pre>
  `

  disabled: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
