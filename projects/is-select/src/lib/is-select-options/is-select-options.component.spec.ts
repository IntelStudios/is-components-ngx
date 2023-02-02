import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {OverlayModule} from '@angular/cdk/overlay';
import {IsCdkService} from '@intelstudios/cdk';
import {FormControl, FormControlDirective} from '@angular/forms';
import {ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule, By} from '@angular/platform-browser';
import {IsSelectOptionsComponent} from './is-select-options.component';
import {IsSelectOptionComponent} from '../is-select-option/is-select-option.component';
import {IsSelectOptionSelectedDirective} from '@intelstudios/select';
import {IsSelectOptionDirective} from '../is-select.directives';
import {TestComponentBase} from '../../../../test-base/model.spec';
import {ISelectOptionsControl} from '../is-select.internal.interfaces';
import {SelectItem} from '../select-item';

describe('IsSelectOptionsComponent', () => {
  let componentRoot: TestComponent;
  let fixtureRoot: ComponentFixture<TestComponent>;
  let options:  ISelectOptionsControl;
  let callbacks: {
    loadOptions?: (value: string) => void,
    itemsSelected?: (items: SelectItem[]) => void,
    itemsDeselected?: () => void
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent, IsSelectOptionsComponent,
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

    callbacks = {};

    options = {
      active: null,
      optionTemplate: null,
      searchPlaceholder: 'Search TeSt placeholder',
      options: [],
      alignItems: 'left',
      alignment: 'left',
      minLoadChars: 0,
      isGroupOptions: false,
      isSearch: true,
      multipleConfig: null,
      onClosed: () => {},
      onLoadOptions: (value: string) => {if (callbacks.loadOptions) {console.log('optionsLoad', value); callbacks.loadOptions(value); }},
      onItemSelected: (_: SelectItem) => {},
      onItemUnselected: (_: SelectItem) => {},
      onItemsSelected:
        (items: SelectItem[]) => {if (callbacks.itemsSelected) {console.log('itemsSelected', items); callbacks.itemsSelected(items); }},
      onItemsDeselected: () => {
        if (callbacks.itemsDeselected) {console.log('itemsDeselected'); callbacks.itemsDeselected(); }
      }
    };

    componentRoot.options.control = options;
    fixtureRoot.detectChanges();
  });

  it('should show options', async () => {
    const comp = componentRoot.options;
    const el = componentRoot.optionsEl;
    comp.setOptions(componentRoot.colors);
    await componentRoot.afterChanges();

    const optionTexts: string[] = [];
    el.nativeElement.querySelectorAll('is-select-option').forEach((x) => optionTexts.push(x.textContent));

    for (const col of componentRoot.colors) {
      expect(optionTexts.find((text) => text.includes(col.Value))).withContext(`should show "${col.Value}" option`).toBeDefined();
    }
  });

  it('should ask to load options', async () => {
    const comp = componentRoot.options;
    comp.control.minLoadChars = 3;
    await componentRoot.afterChanges();

    let loadRequestValue;

    callbacks.loadOptions = (value) => loadRequestValue = value;
    // we cannot create our event with data
    // because of https://stackoverflow.com/questions/54460136/unit-testing-keyboardevent-returning-istrusted-false-and-cannot-read-propert

    comp.onSearchChange('Te');
    comp.onSearchChange('TeS');
    comp.onSearchChange('TeSt');
    await componentRoot.afterChanges();
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (loadRequestValue !== undefined) {
          callbacks.loadOptions = undefined;
          clearInterval(interval);
          resolve(loadRequestValue);
        }
      }, 10);
    });

    expect(loadRequestValue).withContext('should load options exactly on 3 characters').toBe('TeS');
  });

  it('should use custom template', async () => {
    const comp = componentRoot.options;
    const el = componentRoot.optionsEl;
    comp.optionTemplate = componentRoot.customOptionsTemplate;
    comp.setOptions(componentRoot.colors);
    await componentRoot.afterChanges();

    const optionTexts: string[] = [];
    el.nativeElement.querySelectorAll('is-select-option').forEach((x) => optionTexts.push(x.textContent));

    for (const col of componentRoot.colors) {
      expect(optionTexts.find((text) => text.includes('HoDnOta: ' + col.Value)))
        .withContext(`should show "${col.Value}" option`).toBeDefined();
    }
  });

  it('should select all and nothing', async () => {
    const comp = componentRoot.options;
    const el = componentRoot.optionsEl;
    comp.setOptions(componentRoot.colors);
    comp.multipleConfig = {
      showButtons: true,
      selectAll: {label: 'allTest', cssClass: 'allTest'},
      deselectAll: {label: 'nothingTest', cssClass: 'nothingTest'}
    };
    await componentRoot.afterChanges();

    const values = [componentRoot.colors[0], componentRoot.colors[1]];
    comp.setValue(values);
    await componentRoot.afterChanges();

    let selectedItems: SelectItem[];
    let itemsUnselected = false;

    callbacks.itemsSelected = (items) => selectedItems = items;
    callbacks.itemsDeselected = () => itemsUnselected = true;

    const btnAll = componentRoot.getDebugElement(el).query(By.css('.allTest'));
    const btnNothing = componentRoot.getDebugElement(el).query(By.css('.nothingTest'));

    btnAll.triggerEventHandler('click', undefined);
    await componentRoot.afterChanges();

    for (const col of componentRoot.colors) {
      expect(selectedItems.find((item => item.ID === col.ID))).withContext(`${col} should be selected`).toBeDefined();
    }

    btnNothing.triggerEventHandler('click', undefined);
    await componentRoot.afterChanges();
    expect(itemsUnselected).withContext('nothing should be selected').toBeTrue();
  });

  it('should render group with children', async () => {
    const comp = componentRoot.options;
    const el = componentRoot.optionsEl;
    comp.setOptions(componentRoot.groups);
    await componentRoot.afterChanges();

    const values: HTMLElement[] = [];
    el.nativeElement.querySelectorAll('is-select-option').forEach((x) => values.push(x as HTMLElement));

    expect(values.find((element) => element.querySelector('.group-divider') && element.textContent.includes('TestGroup'))).toBeDefined();

    for (const col of componentRoot.colors) {
      expect(values.find((element) => element.textContent.includes(col.Value)))
        .withContext(`should show "${col.Value}" option`).toBeDefined();
    }
  });

});

@Component({
  template: `
    <style>.hidden {visibility: hidden;}</style>

    <is-select-options id="testOptions" #options></is-select-options>

    <ng-template #customOptionsTemplate let-item="item">
      <div>HoDnOta: {{item.Value}}</div>
    </ng-template>
  `
})
class TestComponent extends TestComponentBase<TestComponent> {
  @ViewChild('options', {static: true, read: ElementRef}) public optionsEl: ElementRef<HTMLElement>;
  @ViewChild('options', {static: true}) public options: IsSelectOptionsComponent;
  @ViewChild('customOptionsTemplate', {static: true}) public customOptionsTemplate: IsSelectOptionDirective;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  readonly colors: SelectItem[] = [
    { ID: 1, Value: 'red', background: 'red' },
    { ID: 2, Value: 'green', background: 'green' },
    { ID: 3, Value: 'black', background: 'black' },
    { ID: 4, Value: 'yellow', background: 'yellow' }
  ].map((item) => new SelectItem(item));

  readonly groups: SelectItem[] = [new SelectItem({
    ID: '1', Value: 'TestGroup', children: this.colors
  })];

  public control = new FormControl();
}
