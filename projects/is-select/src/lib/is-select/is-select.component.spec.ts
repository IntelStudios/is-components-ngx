import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {IsSelectComponent} from './is-select.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {IsCdkService} from '@intelstudios/cdk';
import {FormControl, FormControlDirective} from '@angular/forms';
import {ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule, By} from '@angular/platform-browser';
import {IsSelectOptionsComponent} from '../is-select-options/is-select-options.component';
import {IsSelectOptionComponent} from '../is-select-option/is-select-option.component';
import {IsSelectOptionSelectedDirective} from '@intelstudios/select';
import {IsSelectOptionDirective} from '../is-select.directives';
import {Observable, of} from 'rxjs';
import {TestComponentBase} from '../../../../test-base/model.spec';
import {SelectItem} from '../select-item';

describe('IsSelectComponent', () => {
  let componentRoot: TestComponent;
  let fixtureRoot: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent, IsSelectComponent, IsSelectOptionsComponent,
        IsSelectOptionComponent, IsSelectOptionSelectedDirective,
        IsSelectOptionDirective,
        FormControlDirective
      ],
      imports: [OverlayModule, CommonModule, BrowserModule],
      providers: [
        {provide: IsCdkService},
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureRoot = TestBed.createComponent(TestComponent);
    componentRoot = fixtureRoot.componentInstance;
    componentRoot.fixture = fixtureRoot;
    fixtureRoot.detectChanges();
  });

  it('should create', () => {
    expect(componentRoot).toBeDefined();
  });

  /*
   * SINGLE TESTS
   */
  it('should show placeholder', () => {
    expect(componentRoot.getPlaceholderEl(componentRoot.placeholderTestEl).textContent.trim())
      .toBe('TeSt');
  });

  it('should NOT show placeholder', () => {
    expect(componentRoot.getPlaceholderEl(componentRoot.placeholderShowTestEl))
      .toBeNull();
  });

  it('should select London', async () => {
    const control = componentRoot.control;

    expect(control.value).withContext('initial value').toBeNull();
    control.setValue('London');
    expect(control.value).withContext('set value to London').toBe('London');
    control.setValue(null);
    expect(control.value).withContext('reset to null').toBeNull();

    expect(await componentRoot.onFirstValue(control, 'London')).withContext('set value to London async').toBe('London');
    expect(componentRoot.getValueTextEl(componentRoot.selectValue)?.textContent).toContain('London');
  });

  it('should allow value clearing', async () => {
    const control = componentRoot.control;
    const selectClearEnabled = componentRoot.allowClear;
    const selectClearDisabled = componentRoot.selectValue;

    expect(componentRoot.getBtnClearEl(selectClearDisabled)).withContext('clear button should not be visible on empty value #1').toBeNull();
    expect(componentRoot.getBtnClearEl(selectClearEnabled)).withContext('clear button should not be visible on empty value #2').toBeNull();

    await componentRoot.onFirstValue(control, 'London');
    expect(componentRoot.getBtnClearEl(selectClearDisabled))
      .withContext('clear button should not be visible when clearing is disabled').toBe(null);
    expect(componentRoot.getBtnClearEl(selectClearEnabled))
      .withContext('clear button should be visible when clearing is enabled').not.toBeNull();

    await componentRoot.onFirstValue(control, null);
    expect(componentRoot.getBtnClearEl(selectClearDisabled)).withContext('clear button should not be visible on empty value #3').toBeNull();
    expect(componentRoot.getBtnClearEl(selectClearEnabled)).withContext('clear button should not be visible on empty value #4').toBeNull();
  });

  it('should disable', async () => {
    const element = componentRoot.selectValue;
    const control = componentRoot.control;
    const disabledSelector = '.ui-select-container.disabled';

    await componentRoot.onDisabledChange(control, true);
    expect(element.nativeElement.querySelector(disabledSelector)).withContext('control is disabled').not.toBeNull();

    await componentRoot.onDisabledChange(control, false);
    expect(element.nativeElement.querySelector(disabledSelector)).withContext('control is enabled').toBeNull();
  });

  it('should load items async', async () => {
    const element = componentRoot.selectColorValue;
    const control = componentRoot.control;

    control.setValue(2);
    await componentRoot.loadColors();
    expect(componentRoot.getValueTextEl(element)?.textContent).toContain('green');
  });

  it('should replace text content when values loaded', async () => {
    const element = componentRoot.selectMultiAsync;
    const control = componentRoot.control5;

    await componentRoot.onFirstValue(control, [{ID: 2, Value: 'orange'}]);
    await componentRoot.afterChanges();
    expect(componentRoot.getValueTextEl(element)?.textContent).toContain('orange');
    await componentRoot.loadColors();
    expect(componentRoot.getValueTextEl(element)?.textContent).toContain('green');
  });

  it('should open search options', async () => {
    const element = componentRoot.lazyLoadSearch;

    expect(componentRoot.getSelectOptions()).withContext('no search should be shown').toBeNull();
    await componentRoot.openSelectOptions(element);
    expect(componentRoot.getSelectOptions()).withContext('search should be visible').not.toBeNull();
  });

  it('should select multiple', async () => {
    const element = componentRoot.selectMultiEl;
    const control = componentRoot.control2;

    const values = [componentRoot.colorItems[1], componentRoot.colorItems[2]];
    await componentRoot.onFirstValue(control, values.map((x) => x.ID));
    await componentRoot.afterChanges();

    const selectedValueTexts = componentRoot.getValueTextEls(element).map((x) => x.textContent);

    expect(selectedValueTexts.length).withContext(`should have the length of ${values.length}`).toBe(values.length);

    for (let i = 0; i < values.length; i++) {
      expect(selectedValueTexts[i]).withContext(`${i + 1}. value should be ${values[i]}`).toContain(values[i].Value);
    }
  });

  it('should correctly resize when enabled', async () => {
    const elementResizable = componentRoot.selectMultiEl;
    const elementFixed = await componentRoot.getSelectMultiFixed();

    const control = componentRoot.control2;

    await componentRoot.onFirstValue(control, componentRoot.colorItems.map((x) => x.ID));
    await componentRoot.afterChanges();

    expect(elementResizable.nativeElement.getBoundingClientRect().height)
      .withContext('is resizable, should have higher height')
      .toBeGreaterThan(elementFixed.nativeElement.getBoundingClientRect().height * 3);
  });

  it('should respect unsetNoMatch value', async () => {
    const controlKeep = componentRoot.control4;
    const controlUnset = componentRoot.control3;

    await componentRoot.onFirstValue(controlKeep, new SelectItem({ ID: 1000, Value: 'transparent' }));
    await componentRoot.onFirstValue(controlUnset, new SelectItem({ ID: 1000, Value: 'transparent' }));
    await componentRoot.afterChanges();

    expect(controlKeep.value.ID).toBe('1000');
    expect(controlUnset.value.ID).toBe('1000');

    await componentRoot.loadColors();
    await componentRoot.afterChanges();

    expect(controlKeep.value.ID).toBe('1000');
    expect(controlUnset.value).toBeNull();
  });
});

@Component({
  template: `
    <style>.hidden {visibility: hidden; position: fixed;} .width { width: 100px; }</style>

    <is-select #placeholder [placeholder]="'TeSt'" class="hidden">></is-select>

    <is-select #placeholderShow [placeholderShow]="false" class="hidden">></is-select>

    <is-select #selectValue [formControl]="control" [items]="items" class="hidden"></is-select>

    <is-select #allowClear [formControl]="control" [items]="items" [allowClear]="true" class="hidden"></is-select>

    <is-select #selectColorValue [formControl]="control" [items]="colors" class="hidden"></is-select>

    <is-select #selectMulti [formControl]="control2" [items]="colorItems" [multipleConfig]="{showButtons: true}" class="hidden width"></is-select>

    <is-select #selectMultiAsync [modelConfig]="{idProp: 'ID', textProp: 'Value'}"  [formControl]="control5" [items]="colors" [multipleConfig]="{}" class="hidden"></is-select>

    <is-select *ngIf="showSelectMultiFixed" #selectMultiFixed [formControl]="control2" [items]="colorItems" [multipleConfig]="{showButtons: true}" [resize]="false" class="hidden width"></is-select>

    <is-select id="testLazyLoadSearch" #lazyLoadSearch [formControl]="control" [minLoadChars]="2" [items]="colors$ | async" (loadOptions)="loadColors()" class="hidden"></is-select>

    <is-select [formControl]="control3" [items]="colors" [unsetNoMatch]="true" class="hidden"></is-select>
    <is-select [formControl]="control4" [items]="colors" class="hidden"></is-select>
  `
})
class TestComponent extends TestComponentBase<TestComponent> {
  get selectMultiAsync(): ElementRef<HTMLElement> {
    return TestComponent.useElement(this._selectMultiAsync);
  }
  get selectMultiEl(): ElementRef<HTMLElement> {
    return  TestComponent.useElement(this._selectMultiEl);
  }
  get lazyLoadSearch(): ElementRef<HTMLElement> {
    return TestComponent.useElement(this._lazyLoadSearch);
  }
  get selectColorValue(): ElementRef<HTMLElement> {
    return TestComponent.useElement(this._selectColorValue);
  }
  get allowClear(): ElementRef<HTMLElement> {
    return TestComponent.useElement(this._allowClear);
  }
  get selectValue(): ElementRef<HTMLElement> {
    return TestComponent.useElement(this._selectValue);
  }
  get placeholderShowTestEl(): ElementRef<HTMLElement> {
    return TestComponent.useElement(this._placeholderShowTestEl);
  }
  get placeholderTestEl(): ElementRef<HTMLElement> {
    return TestComponent.useElement(this._placeholderTestEl);
  }

  showSelectMultiFixed = false;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  colorItems: SelectItem[] = [
    { ID: 1, Value: 'red', background: 'red' },
    { ID: 2, Value: 'green', background: 'green' },
    { ID: 3, Value: 'black', background: 'black' },
    { ID: 4, Value: 'yellow', background: 'yellow' }
  ].map((x) => new SelectItem(x));
  colors: unknown = undefined;
  colors$: Observable<unknown> = undefined;

  @ViewChild('placeholder', {static: true, read: ElementRef}) private _placeholderTestEl: ElementRef<HTMLElement>;
  @ViewChild('placeholderShow', {static: true, read: ElementRef}) private _placeholderShowTestEl: ElementRef<HTMLElement>;
  @ViewChild('selectValue', {static: true, read: ElementRef}) private _selectValue: ElementRef<HTMLElement>;
  @ViewChild('allowClear', {static: true, read: ElementRef}) private _allowClear: ElementRef<HTMLElement>;
  @ViewChild('selectColorValue', {static: true, read: ElementRef}) private _selectColorValue: ElementRef<HTMLElement>;
  @ViewChild('lazyLoadSearch', {static: true, read: ElementRef}) private _lazyLoadSearch: ElementRef<HTMLElement>;
  @ViewChild('selectMultiFixed', {static: false, read: ElementRef}) private _selectMultiFixed: ElementRef<HTMLElement>;
  @ViewChild('selectMulti', {static: true, read: ElementRef}) private _selectMultiEl: ElementRef<HTMLElement>;
  @ViewChild('selectMultiAsync', {static: true, read: ElementRef}) private _selectMultiAsync: ElementRef<HTMLElement>;

  public items: Array<string> = [
    'Amsterdam', 'Nové Město za devatero řekami a desatero horami a jedenáctero černými lesy',
    'Antwerp', 'Athens', 'Barcelona',
    'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
    'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
    'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
    'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
    'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
    'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
    'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
    'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
    'Zagreb', 'Zaragoza', 'Łódź'
  ];

  public control = new FormControl();
  public control2 = new FormControl();
  public control3 = new FormControl();
  public control4 = new FormControl();
  public control5 = new FormControl();

  async getSelectMultiFixed(): Promise<ElementRef<HTMLElement>> {
    this.showSelectMultiFixed = true;
    await this.afterChanges();
    return TestComponent.useElement(this._selectMultiFixed);
  }

  public getPlaceholderEl(select: ElementRef<HTMLElement>): HTMLElement | null {
    return select.nativeElement.querySelector('.ui-select-placeholder');
  }

  public getBtnClearEl(select: ElementRef<HTMLElement>): HTMLElement | null {
    return select.nativeElement.querySelector('.btn-remove');
  }

  public getValueTextEl(select: ElementRef<HTMLElement>): HTMLElement | null {
    return select.nativeElement.querySelector('.ui-select-match-text');
  }

  public getValueTextEls(select: ElementRef<HTMLElement>): HTMLElement[] {
    const r = [];
    select.nativeElement.querySelectorAll('.ui-select-match-text').forEach((e) => r.push(e));
    return r;
  }

  public getSelectOptions(): HTMLElement | null {
    return document.body.querySelector('is-select-options');
  }

  public async openSelectOptions(select: ElementRef<HTMLElement>): Promise<void> {
    this.getDebugElement(select).query(By.css('.ui-select-match')).triggerEventHandler('click', {});
    await this.afterChanges();
  }

  public async loadColors(): Promise<void> {
    const values = [
      { ID: 1, Value: 'red', background: 'red' },
      { ID: 2, Value: 'green', background: 'green' },
      { ID: 3, Value: 'black', background: 'black' },
      { ID: 4, Value: 'yellow', background: 'yellow' }
    ];
    this.colors = values;
    this.colors$ = of(values);
    await this.afterChanges();
  }
}
