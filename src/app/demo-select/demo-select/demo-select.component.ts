import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { of, Observable, Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-demo-select',
  templateUrl: './demo-select.component.html',
  styleUrls: ['./demo-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoSelectComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/8.x/package/is-select-8.0.9.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsSelectModule } from 'is-select';</pre>
`

  select1Control: FormControl = new FormControl();
  select2Control: FormControl = new FormControl();
  select3Control: FormControl = new FormControl();
  select4Control: FormControl = new FormControl();
  select4ControlMulti: FormControl = new FormControl();
  select5Control: FormControl = new FormControl();
  select5ControlMulti: FormControl = new FormControl();
  select6Control: FormControl = new FormControl();
  select6ControlMulti: FormControl = new FormControl();
  select7Control: FormControl = new FormControl();
  selectColorControl: FormControl = new FormControl();

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

  itemsBadges = [
    { ID: 0, Value: '[default_Default]' },
    { ID: 1, Value: '[danger_Danger]' },
    { ID: 2, Value: '[warning_Warning]' },
    { ID: 3, Value: '[info_Info]' },
    { ID: 4, Value: '[success_Success]' },
    { ID: 5, Value: '[primary_Primary]' }
  ];

  itemsWithDesc = [{ ID: 1, Value: 'red', Description: 'Desc red' },
  { ID: 2, Value: 'green', Description: 'Desc green' },
  { ID: 3, Value: 'black', Description: 'Desc black' }]

  itemsGrouped: any[] = [];
  itemsGrouped$: Observable<any[]>;
  private value: any = {};
  private _disabledV: string = '0';
  private disabled: boolean = false;

  constructor(private changeDetector: ChangeDetectorRef) {
    this.selectColorControl.setValidators(Validators.required);
  }

  ngOnInit() {

    const item1: any = {
      ID: '1', Value: 'Europe', children:
        [
          { ID: '11', Value: 'Czech', children: [
              {ID: '111', Value: 'Olomouc' },
              {ID: '112', Value: 'Prague' },
            ]
          },
          { ID: '12', Value: 'Poland', Disabled: true },
          { ID: '13', Value: 'Nederlands', Disabled: true }
        ]
    };
    const item2: any = {
      ID: '2', Value: 'Asia', children: [
        { ID: '21', Value: 'China' },
        { ID: '22', Value: 'Thailand' },
        { ID: '23', Value: 'Malaysia', Disabled: true },
        { ID: '24', Value: 'Russia', Disabled: true }
      ]
    };
    const item3: any = {
      ID: '3', Value: 'USA', children:
        [
          { ID: '31', Value: 'Miami' },
          { ID: '32', Value: 'Florida', Disabled: true },
          { ID: '33', Value: 'LA', Disabled: true }
        ]
    };

    const item4 = {ID: '4', Value: 'Mars'};

    this.itemsGrouped = [item1, item2, item3, item4];
    this.changeDetector.markForCheck();
  }

  toggleInvalid(ctrl: FormControl) {
    if (ctrl.errors) {
      ctrl.setErrors(null);
    } else {
      ctrl.setErrors({ invalid: true });
    }
  }

  loadItemsGrouped() {
    this.itemsGrouped$ = of([...this.itemsGrouped]);
    this.changeDetector.markForCheck();
  }

  toggleDisable() {
    this.select1Control.enabled ? this.select1Control.disable() : this.select1Control.enable();
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

  selectGreenModel() {
    this.select4Control.setValue({ Data: '2', Name: 'green (model)' });
  }

  selectGreenModelMulti() {
    this.select4ControlMulti.setValue([{ Data: '2', Name: 'green (model)' }]);
  }

  selectFirstModel() {
    this.select6Control.setValue({ ID: 666, Value: 'xxx (unknown model)' });
  }

  selectFirstModelMulti() {
    this.select6ControlMulti.setValue([{ ID: 666, Value: 'xxx (unknown model)' }]);
  }

  moreOptions$: BehaviorSubject<any[]> = new BehaviorSubject(null);

  onOptionsRequired($event: any) {

    if ($event == null) {
      console.log('Should cancel loading');
      return;
    }
    console.log(`Loading options filter=${$event}`);
    setTimeout(() => {
      this.moreOptions$.next([
        { ID: 1, Value: 'aaaaa' },
        { ID: 2, Value: 'aaaab' },
        { ID: 3, Value: 'aaaac' },
        { ID: 4, Value: 'aaaad' },
        { ID: 5, Value: 'aaaba' },
        { ID: 6, Value: 'aaabb' },
      ]);

    }, 1000);
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
