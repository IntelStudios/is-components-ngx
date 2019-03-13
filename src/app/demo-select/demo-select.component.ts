import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-demo-select',
  templateUrl: './demo-select.component.html',
  styleUrls: ['./demo-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoSelectComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-select-7.0.7.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsSelectModule } from 'is-select';</pre>
`

  select1Control: FormControl;
  select2Control: FormControl;
  select3Control: FormControl;

  public items: Array<string> = ['Amsterdam', 'Nové Město za devatero řekami a desatero horami a jedenáctero černými lesy', 'Antwerp', 'Athens', 'Barcelona',
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
    { ID: 1, Value: 'red', background: 'red' },
    { ID: 2, Value: 'green', background: 'green' },
    { ID: 3, Value: 'black', background: 'black' }
  ];
  colors = undefined;
  colors$ = undefined;

  itemsGrouped: any[] = [];

  private value: any = {};
  private _disabledV: string = '0';
  private disabled: boolean = false;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.select1Control = new FormControl();
    this.select2Control = new FormControl();
    this.select3Control = new FormControl();

    let item1: any = {
      ID: '1', Value: 'Europe', children:
        [
          { ID: '11', Value: 'Czech' },
          { ID: '12', Value: 'Poland', Disabled: true },
          { ID: '13', Value: 'Nederlands', Disabled: true }
        ]
    };
    let item2: any = { ID: '2', Value: 'Asia', children: [
      { ID: '111', Value: 'China' },
      { ID: '112', Value: 'Thailand' },
      { ID: '113', Value: 'Malaysia', Disabled: true },
      { ID: '114', Value: 'Russia', Disabled: true }
    ]};
    let item3: any = {
      ID: '3', Value: 'USA', children:
        [
          { ID: '1111', Value: 'Miami' },
          { ID: '1112', Value: 'Florida', Disabled: true },
          { ID: '1113', Value: 'LA', Disabled: true  }
        ]
    };

    this.itemsGrouped.push(item1, item2, item3);
    this.changeDetector.markForCheck();
  }

  selectLondon() {
    this.select1Control.setValue('London');
  }

  selectGreen() {
    this.select2Control.setValue(2);
  }

  loadMore() {
    this.colors = [
      { ID: 1, Value: 'red', background: 'red' },
      { ID: 2, Value: 'green', background: 'green' },
      { ID: 3, Value: 'black', background: 'black' },
      { ID: 4, Value: 'yellow', background: 'yellow' }
    ];
    this.changeDetector.markForCheck();
  }

  loadMoreAsync() {
    setTimeout(() => {
      this.colors$ = of([
        { ID: 1, Value: 'red', background: 'red' },
        { ID: 2, Value: 'green', background: 'green' },
        { ID: 3, Value: 'black', background: 'black' },
        { ID: 4, Value: 'yellow', background: 'yellow' }
      ]);
      this.changeDetector.markForCheck();
    }, 2000);
  }


  selectUnknown() {
    this.select1Control.setValue('Olomouc???');
  }

  selectNetherlands() {
    this.select3Control.setValue(13);
  }

  private get disabledV(): string {
    return this._disabledV;
  }

  private set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value: any): void {
    console.log('Selected value is: ', value);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  public typed(value: any): void {
    console.log('New search input: ', value);
  }

  public changed(value: any): void {
    console.log('New value', value);
  }

}
