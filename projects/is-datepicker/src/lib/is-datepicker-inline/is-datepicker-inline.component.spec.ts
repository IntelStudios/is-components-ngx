import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {EventEmitterHandler, TestComponentBase} from '../../../../test-base/model.spec';
import {ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild} from '@angular/core';
import {FormControlDirective, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {IsCdkService} from '@intelstudios/cdk';
import {NgxMaskModule} from 'ngx-mask';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {IsDatepickerInlineComponent} from './is-datepicker-inline.component';
import {defaultDatePickerConfig} from '../is-datepicker-popup/is-datepicker-popup.component';
import {configToken} from '../is-datepicker.interfaces';

describe('IsDatepickerInlineComponent', () => {
  let componentRoot: TestComponent;
  let fixtureRoot: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        FormControlDirective,
        IsDatepickerInlineComponent
      ],
      imports: [
        OverlayModule, CommonModule, BrowserModule, NgxMaskModule.forRoot(), OverlayModule,
        TimepickerModule.forRoot(), FormsModule, ScrollingModule, ReactiveFormsModule
      ],
      providers: [
        {provide: IsCdkService},
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

  it('should have initial default config', () => {
    const {picker} = componentRoot;
    expect(picker.config).toEqual(defaultDatePickerConfig());
  });

  it('should accept injected config', () => {
    const {picker} = componentRoot;
    expect(picker.rootConfig['_tesT']).toBe('YeS');
  });

  it('should convert empty string to null value', () => {
    const {picker} = componentRoot;
    picker.writeValue('');
    expect(picker.dateValue).toBeNull();
  });
});

@Component({
  template: `
    <is-datepicker-inline #picker></is-datepicker-inline>
    <is-datepicker-inline #pickerString [stringMode]="true"></is-datepicker-inline>
  `
})
class TestComponent extends TestComponentBase<TestComponent> {
  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  @ViewChild('picker', {static: true})
  picker: IsDatepickerInlineComponent;

  @ViewChild('picker', {static: true, read: ElementRef})
  pickerEl: ElementRef<HTMLElement>;

  @ViewChild('pickerString', {static: true})
  pickerString: IsDatepickerInlineComponent;
}
