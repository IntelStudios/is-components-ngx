import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {EventEmitterHandler, TestComponentBase} from '../../../../test-base/model.spec';
import {ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild} from '@angular/core';
import {FormControlDirective, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule, DatePipe} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {IsCdkService} from '@intelstudios/cdk';
import {NgxMaskModule} from 'ngx-mask';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {configToken} from '../is-datepicker.interfaces';
import {IsDatepickerComponent} from './is-datepicker.component';
import {defaultDatePickerConfig} from '../is-datepicker-popup/is-datepicker-popup.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';

describe('IsDatepickerComponent', () => {
  let componentRoot: TestComponent;
  let fixtureRoot: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        FormControlDirective,
        IsDatepickerComponent
      ],
      imports: [
        OverlayModule, CommonModule, BrowserModule, NgxMaskModule.forRoot(), OverlayModule,
        TimepickerModule.forRoot(), FormsModule, ScrollingModule, ReactiveFormsModule,
        BsDatepickerModule
      ],
      providers: [
        {provide: IsCdkService},
        {provide: DatePipe},
        {provide: configToken, useValue: {'_tesT': 'YeS'}}
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
    expect(componentRoot).toBeTruthy();
  });

  it('should reset invalid value', () => {
    const {picker} = componentRoot;
    const timeNow = Date.now();
    picker.dateValue = 'invalid value';
    picker.onValueChange();
    expect((picker.dateValue as Date).getTime()).toBeGreaterThanOrEqual(timeNow);
  });

  it('should keep valid value', () => {
    const {picker} = componentRoot;
    const now = new Date();
    picker.dateValue = now;
    picker.onValueChange();
    expect((picker.dateValue as Date).getTime()).toBe(now.getTime());
  });

  it('should emit values', async () => {
    const {picker} = componentRoot;
    const handler = new EventEmitterHandler(picker.changed);

    const value = new Date(2011, 10, 9);
    picker.dateValue = value;
    picker.onValueChange();
    await handler.waitForNewValue();
    expect(handler.valueLast).toBe(value);
  });

  it('should respect string mode settings', async () => {
    const {picker, pickerString} = componentRoot;
    const handler = new EventEmitterHandler(picker.changed);
    const handlerString = new EventEmitterHandler(pickerString.changed);

    const value = new Date(2011, 10, 9);
    picker.dateValue = value;
    pickerString.dateValue = value;
    picker.onValueChange();
    pickerString.onValueChange();

    await handler.waitForNewValue();
    await handlerString.waitForNewValue();

    expect(handler.valueLast).toBe(value);
    expect(handlerString.valueLast).toBe('09-11-2011');
  });

  it('should remove hours when localDateMode is enabled',  async () => {
    const {picker, pickerLocal} = componentRoot;
    const value = new Date(2011, 10, 9, 8, 7, 6);
    const valueZeroHours = value;
    valueZeroHours.setHours(0);
    valueZeroHours.setMinutes(0);
    valueZeroHours.setSeconds(0);

    const handler = new EventEmitterHandler(picker.changed);
    const handlerLocal = new EventEmitterHandler(pickerLocal.changed);

    picker.dateValue = value;
    pickerLocal.dateValue = value;
    picker.onValueChange();
    pickerLocal.onValueChange();

    await handler.waitForNewValue();
    await handlerLocal.waitForNewValue();

    expect(picker.dateValue).toEqual(value);
    expect(pickerLocal.dateValue).toEqual(valueZeroHours);
  });

  it('should have initial default config', () => {
    const {picker} = componentRoot;
    expect(picker.config).toEqual(defaultDatePickerConfig());
  });

  it('should accept injected config', () => {
    const {picker} = componentRoot;
    expect(picker.rootConfig['_tesT']).toBe('YeS');
  });

  it('should open popup on click when enabled',  async () => {
    const {picker} = componentRoot;

    // open on first click
    picker.onInputClick();
    await componentRoot.afterChanges();
    expect(picker.isOpen).toBeTrue();
    expect(componentRoot.isPopupOpened()).toBeTrue();

    // close on second click
    picker.onInputClick();
    await componentRoot.afterChanges();
    expect(picker.isOpen).toBeFalse();
    expect(componentRoot.isPopupOpened()).toBeFalse();

    // should not open when mask is set
    picker.mask = '0000-00-00';
    picker.onInputClick();
    await componentRoot.afterChanges();
    expect(picker.isOpen).toBeFalse();
    expect(componentRoot.isPopupOpened()).toBeFalse();
  });

  it('should open and close popup from code',  async () => {
    const {picker} = componentRoot;

    await componentRoot.afterChanges();
    expect(picker.isOpen).toBeFalse();
    expect(componentRoot.isPopupOpened()).toBeFalse();

    picker.openPopup();
    await componentRoot.afterChanges();
    expect(picker.isOpen).toBeTrue();
    expect(componentRoot.isPopupOpened()).toBeTrue();

    picker.closePopup();
    await componentRoot.afterChanges();
    expect(picker.isOpen).toBeFalse();
    expect(componentRoot.isPopupOpened()).toBeFalse();
  });

  it('should not open popup when readonly',  async () => {
    const {picker} = componentRoot;
    picker.setReadonly(true);

    picker.openPopup();
    await componentRoot.afterChanges();
    expect(picker.isOpen).toBeFalse();
  });

  it('should not open popup when disabled',  async () => {
    const {picker} = componentRoot;
    picker.setDisabledState(true);

    picker.openPopup();
    await componentRoot.afterChanges();
    expect(picker.isOpen).toBeFalse();
  });

  it('should change date when arrow up is pressed', async () => {
    const {picker} = componentRoot;
    const handler = new EventEmitterHandler(picker.changed);

    const value = new Date(2011, 10, 9);
    const dayUp = new Date(2011, 10, 10);
    const dayDown = new Date(2011, 10, 8);

    picker.dateValue = value;
    // noinspection TypeScriptValidateTypes
    // @ts-ignore
    picker.onInputValueChange({key: 'ArrowUp', target: {value: ''}});
    await handler.waitForNewValue();
    expect(handler.valueLast.getTime()).toBe(dayUp.getTime());

    picker.dateValue = value;
    // noinspection TypeScriptValidateTypes
    // @ts-ignore
    picker.onInputValueChange({key: 'ArrowDown' , target: {value: ''}});
    await handler.waitForNewValue();
    expect(handler.valueLast.getTime()).toBe(dayDown.getTime());
  });

  it('should allow clearing value with button when enabled',  async () => {
    const {picker, pickerEl, pickerLocal, pickerLocalEl} = componentRoot;

    const value = new Date(2011, 10, 9);
    picker.dateValue = value;
    pickerLocal.dateValue = value;
    picker.setDisabledState(false);
    pickerLocal.setDisabledState(false);

    await componentRoot.afterChanges();

    expect(componentRoot.getBtnClear(pickerEl)).withContext('clearing is not enabled').toBeNull();
    expect(componentRoot.getBtnClear(pickerLocalEl)).withContext('clearing is enabled').not.toBeNull();

    pickerLocal.setDisabledState(true);
    await componentRoot.afterChanges();
    expect(componentRoot.getBtnClear(pickerLocalEl)).withContext('clearing is enabled, but component is disabled').toBeNull();
  });

  it('should clear the value when pressed',  async () => {
    const {pickerLocal, pickerLocalEl} = componentRoot;
    const handler = new EventEmitterHandler(pickerLocal.changed);

    pickerLocal.dateValue = new Date(2011, 10, 9);
    pickerLocal.setDisabledState(false);

    await componentRoot.afterChanges();
    const btnClear = componentRoot.getBtnClear(pickerLocalEl);
    expect(btnClear).withContext('clearing is enabled').not.toBeNull();

    btnClear.click();
    await handler.waitForNewValue();
    expect(handler.valueLast).toBeNull();
  });

  it('input should be readonly when readonly, no mask or disabled',  async () => {
    const {picker, pickerEl} = componentRoot;
    const input = componentRoot.getInput(pickerEl);

    picker.setReadonly(false);
    picker.setDisabledState(false);
    picker.mask = '0000-00-00';

    await componentRoot.afterChanges();
    expect(input.readOnly).toBeFalse();

    picker.setReadonly(true);
    await componentRoot.afterChanges();
    expect(input.readOnly).toBeTrue();
    picker.setReadonly(false);

    picker.setDisabledState(true);
    await componentRoot.afterChanges();
    expect(input.readOnly).toBeTrue();
    picker.setDisabledState(false);

    picker.mask = '';
    await componentRoot.afterChanges();
    expect(input.readOnly).toBeTrue();
  });

  it('input should have align-* class',  async () => {
    const {pickerEl} = componentRoot;
    const input = componentRoot.getInput(pickerEl);

    const classes: string[] = [];
    input.classList.forEach((x) => classes.push(x));

    expect(classes.find((x) => x.startsWith('align-'))).toBeDefined();
  });

  it('should parse date value from  input',  async () => {
    const {picker} = componentRoot;
    const handler = new EventEmitterHandler(picker.changed);

    const value = new Date(2011, 9, 9);
    const valueString = '09-10-2011';

    picker.dateControl.setValue(new Date(1900, 1, 1));
    await componentRoot.afterChanges();
    // @ts-ignore
    picker.onInputValueChange({key: '1', target: {value: valueString}});

    await handler.waitForNewValue();
    expect(handler.valueLast.getTime()).toBe(value.getTime());
  });
});

@Component({
  template: `
    <is-datepicker #picker></is-datepicker>
    <is-datepicker #pickerLocal [localDateMode]="true" [allowClear]="true"></is-datepicker>
    <is-datepicker #pickerString [stringMode]="true"></is-datepicker>
  `
})
class TestComponent extends TestComponentBase<TestComponent> {
  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  @ViewChild('picker', {static: true})
  picker: IsDatepickerComponent;

  @ViewChild('picker', {static: true, read: ElementRef})
  pickerEl: ElementRef<HTMLElement>;

  @ViewChild('pickerString', {static: true})
  pickerString: IsDatepickerComponent;

  @ViewChild('pickerLocal', {static: true})
  pickerLocal: IsDatepickerComponent;

  @ViewChild('pickerLocal', {static: true, read: ElementRef})
  pickerLocalEl: ElementRef<HTMLElement>;

  isPopupOpened(): boolean {
    return document.body.querySelector('is-datepicker-popup') !== null;
  }

  getBtnClear(component: ElementRef<HTMLElement>): HTMLElement | null {
    return component.nativeElement.querySelector('.btn-remove.shown');
  }

  getInput(component: ElementRef<HTMLElement>): HTMLInputElement | null {
    return component.nativeElement.querySelector('.datepicker-input');
  }
}
