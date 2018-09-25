import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsDatepickerComponent } from './is-datepicker.component';

describe('IsDatepickerComponent', () => {
  let component: IsDatepickerComponent;
  let fixture: ComponentFixture<IsDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
