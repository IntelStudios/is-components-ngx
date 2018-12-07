import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-demo-select',
  templateUrl: './demo-select.component.html',
  styleUrls: ['./demo-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoSelectComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/master/package/is-select-1.1.0.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsSelectModule } from 'is-select';</pre>
`

  select1Control: FormControl;

  public items:Array<string> = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
    'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
    'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
    'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
    'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
    'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
    'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
    'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
    'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
    'Zagreb', 'Zaragoza', 'Łódź'];

    itemsObject = [
      {id: 1, text: 'red', background: 'red'},
      {id: 2, text: 'green', background: 'green'},
      {id: 3, text: 'black', background: 'black'}
    ]

  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;

  selectLondon() {
    this.select1Control.setValue('London');
  }


  selectUnknown() {
    this.select1Control.setValue('Olomouc???');
  }

  private get disabledV():string {
    return this._disabledV;
  }

  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value:any):void {
    console.log('Selected value is: ', value);
  }

  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }

  public typed(value:any):void {
    console.log('New search input: ', value);
  }

  public changed(value:any):void {
    console.log('New value', value);
  }


  constructor() { }

  ngOnInit() {
    this.select1Control = new FormControl();
  }

}
