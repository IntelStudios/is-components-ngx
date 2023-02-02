import {ComponentFixture, TestBed} from '@angular/core/testing';
import {defaultDatePickerConfig, IsDatepickerPopupComponent} from './is-datepicker-popup.component';
import {BsDatepickerConfig, BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('IsDatepickerPopupComponent', () => {
  let component: IsDatepickerPopupComponent;
  let fixture: ComponentFixture<IsDatepickerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsDatepickerPopupComponent ],
      imports: [ BsDatepickerModule, BrowserAnimationsModule ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsDatepickerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default config', () => {
    const defaultConfig = defaultDatePickerConfig();
    const usedConfig = component.config;

    for (const key of Object.keys(defaultConfig)) {
      expect(usedConfig[key])
        .withContext(`"${key}" should be safe as a default value`).toBe(defaultConfig[key]);
    }

    expect(Object.keys(usedConfig).length)
      .withContext('should have same length as default config').toBe(Object.keys(defaultConfig).length);
  });

  it('should update the config partially', () => {
    const defaultConfig = defaultDatePickerConfig();
    const update: Partial<BsDatepickerConfig> = {
      selectFromOtherMonth: false,
      selectWeek: true,
    };
    component.config = {...update};

    const usedConfig = component.config;

    for (const key of Object.keys(defaultConfig)) {
      expect(usedConfig[key])
        .withContext(`"${key}" should be safe as a updated or default value`).toBe(
          key in update ? update[key] : defaultConfig[key]
      );
    }
  });

  it('should emit change when new value differs', () => {
    const initialValue = new Date(2012, 11, 10);
    const val1 = new Date(2011, 10, 9);
    const val2 = new Date(2010, 9, 8);

    component.value = initialValue;
    let emittedValue: Date;
    component.control = {
      onChange: (value) => emittedValue = value
    };

    component.onValueChange(val1);
    expect(emittedValue).withContext('should emit new value change').toBe(val1);
    component.onValueChange(initialValue);
    expect(emittedValue).withContext('should not emit when value is same as the initial').toBe(val1);
    component.onValueChange(val2);
    expect(emittedValue).withContext('should again emit new value change').toBe(val2);
  });
});
