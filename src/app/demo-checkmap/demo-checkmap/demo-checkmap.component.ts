import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-demo-checkmap',
  templateUrl: './demo-checkmap.component.html',
  styleUrls: ['./demo-checkmap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoCheckmapComponent implements OnInit {

  usage: string = `

  <h3>Installation</h3>
  <pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-checkmap-7.0.0.tgz
npm install --save is-checkmap</pre>

  <h3>Import Module</h3>
  <pre>import { IsCheckmapModule } from 'is-checkmap';</pre>


    `

  constructor() { }

  ngOnInit() {
  }

}
