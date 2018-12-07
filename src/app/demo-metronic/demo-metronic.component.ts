import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-metronic',
  templateUrl: './demo-metronic.component.html',
  styleUrls: ['./demo-metronic.component.scss']
})
export class DemoMetronicComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/master/package/is-metronic-1.0.3.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsMetronicModule } from 'is-metronic';</pre>

<h3>Import Styles</h3>
<pre>
// add Metronic styles
@import 'assets/metronic/admin/layout/css/layout.css';
@import 'assets/metronic/admin/layout/css/custom.css';
@import 'assets/metronic/admin/layout/css/themes/darkblue.css';
@import 'assets/metronic/admin/pages/css/profile.css';
@import 'assets/metronic/global/css/components-rounded.css';
@import 'assets/metronic/global/css/plugins.css';
@import 'assets/metronic/admin/layout/css/layout.css';</pre>
  `


  hint: string = `
    <p>Text</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  `

  constructor() { }

  ngOnInit() {
  }

}
