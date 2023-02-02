import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {TestComponentBase} from '../../../test-base/model.spec';
import {ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormControlDirective, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {IsCdkService} from '@intelstudios/cdk';
import {IsTimepickerComponent} from './is-timepicker.component';
import {NgxMaskModule} from 'ngx-mask';
import {IsTimepickerPickerComponent} from './is-timepicker-picker.component';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {ScrollingModule} from '@angular/cdk/scrolling';

describe('IsTimepickerComponent', () => {
  let componentRoot: TestComponent;
  let fixtureRoot: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        FormControlDirective,
        IsTimepickerComponent,
        IsTimepickerPickerComponent,
      ],
      imports: [
        OverlayModule, CommonModule, BrowserModule, NgxMaskModule.forRoot(), OverlayModule,
        TimepickerModule.forRoot(), FormsModule, ScrollingModule, ReactiveFormsModule
      ],
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
    expect(componentRoot).toBeTruthy();
  });

  it('should set value', async () => {
    const control = componentRoot.control1;
    const element = componentRoot.pickerEl;

    const value = '10:11:12';
    await componentRoot.onFirstValue(control, value);

    await componentRoot.afterTick();

    expect(componentRoot.getValueElement(element).value.trim()).toBe(value);
  });

  it('should complete an incomplete value', async () => {
    const control1 = componentRoot.control1;
    const element1 = componentRoot.pickerEl;

    const control2 = componentRoot.control2;
    const element2 = componentRoot.pickerStringModeEl;

    const value = '10';
    await componentRoot.onFirstValue(control1, value);
    await componentRoot.onFirstValue(control2, value);

    await componentRoot.afterTick();

    expect(componentRoot.getValueElement(element1).value.trim()).toBe('10:00:00');
    expect(componentRoot.getValueElement(element2).value.trim()).toBe('10:00:00');
  });

  it('should internally convert date value to correct string', async () => {
    const control2 = componentRoot.control2;
    const element2 = componentRoot.pickerStringModeEl;

    const value = new Date(2020, 1, 1, 10, 11, 12);

    await componentRoot.onFirstValue(control2, value);
    await componentRoot.afterTick();

    expect(control2.value).withContext('should not emit internal state change').toBe(value);

    expect(componentRoot.getValueElement(element2).value.trim()).toBe('10:11:12');
  });

  it('should clear value when set and clearing is allowed', async () => {
    const control = componentRoot.control1;
    const element = componentRoot.pickerEl;

    const control2 = componentRoot.control2;
    const element2 = componentRoot.pickerStringModeEl;

    expect(componentRoot.getClearButtonElement(element))
      .withContext('should be hidden initially 1').toBeNull();
    expect(componentRoot.getClearButtonElement(element2))
      .withContext('should be hidden initially 2').toBeNull();

    const value = '10:11:12';

    await componentRoot.onFirstValue(control, value);
    await componentRoot.onFirstValue(control2, value);
    await componentRoot.afterTick();

    const btnClear = componentRoot.getClearButtonElement(element);
    expect(btnClear).withContext('should be visible when value is set and clearing is enabled').not.toBeNull();
    expect(componentRoot.getClearButtonElement(element2))
      .withContext('should be hidden when value is set and clearing is disabled').toBeNull();

    componentRoot.getDebugElementFromHTMLElement(btnClear).triggerEventHandler('click', new Event('click'));
    await componentRoot.afterChanges();

    expect(componentRoot.getClearButtonElement(element)).withContext('should be hidden when value is cleared').toBeNull();
  });

  it('do not allow clearing when disabled', async () => {
    const control = componentRoot.control1;
    const element = componentRoot.pickerEl;

    const value = '10:11:12';

    await componentRoot.onDisabledChange(control, true);
    await componentRoot.onFirstValue(control, value);
    await componentRoot.afterTick();

    const btnClear = componentRoot.getClearButtonElement(element);
    expect(btnClear).withContext('should not be visible as the control is disabled').toBeNull();
  });

  it('should show time picker', async () => {
    const picker = componentRoot.picker;

    picker.onPickerShown();
    await componentRoot.afterTick();

    expect(componentRoot.getTimePickerPickerElement()).withContext('should be visible after first click').not.toBeNull();

    picker.onPickerShown();
    await componentRoot.afterTick();

    expect(componentRoot.getTimePickerPickerElement()).withContext('should be hidden after second click').toBeNull();
  });

  it('should respect string mode settings', async () => {
    const control1 = componentRoot.control1;
    const picker1 = componentRoot.picker;

    const control2 = componentRoot.control2;
    const picker2 = componentRoot.pickerStringMode;

    const value = new Date(2020, 1, 1, 10, 11, 12);
    picker1.timeControl.setValue(value);
    // @ts-ignore
    picker1.onInputValueChange(value);

    picker2.timeControl.setValue(value);
    // @ts-ignore
    picker2.onInputValueChange(value);

    await componentRoot.afterChanges();

    expect(control1.value).withContext('should be kept as date').toBe(value);
    expect(control2.value).withContext('should be converted into string').toBe('10:11:12');
  });

});

@Component({
  template: `
    <is-timepicker #picker [formControl]="control1" [stringMode]="false" [allowClear]="true"></is-timepicker>
    <is-timepicker #pickerStringMode [formControl]="control2" [stringMode]="true" [allowClear]="false"></is-timepicker>
  `
})
class TestComponent extends TestComponentBase<TestComponent> {
  @ViewChild('picker', {static: true})
  picker: IsTimepickerComponent;

  @ViewChild('picker', {static: true, read: ElementRef})
  pickerEl: ElementRef<HTMLElement>;

  @ViewChild('pickerStringMode', {static: true, read: ElementRef})
  pickerStringModeEl: ElementRef<HTMLElement>;

  @ViewChild('pickerStringMode', {static: true})
  pickerStringMode: IsTimepickerComponent;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  readonly control1 = new FormControl();
  readonly control2 = new FormControl();

  public getValueElement(picker: ElementRef<HTMLElement>): HTMLInputElement {
    return picker.nativeElement.querySelector('.timepicker-value');
  }

  public getClearButtonElement(picker: ElementRef<HTMLElement>): HTMLElement | null {
    return picker.nativeElement.querySelector('.btn-remove.shown');
  }

  public getTimePickerPickerElement(): HTMLElement | null {
    return document.body.querySelector('is-timepicker-picker');
  }
}
