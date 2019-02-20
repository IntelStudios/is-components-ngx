import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsTimepickerComponent } from './is-timepicker.component';

describe('IsTimepickerComponent', () => {
  let component: IsTimepickerComponent;
  let fixture: ComponentFixture<IsTimepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsTimepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsTimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
