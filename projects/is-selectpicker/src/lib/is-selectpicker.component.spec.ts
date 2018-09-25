import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsSelectpickerComponent } from './is-selectpicker.component';

describe('IsSelectpickerComponent', () => {
  let component: IsSelectpickerComponent;
  let fixture: ComponentFixture<IsSelectpickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsSelectpickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsSelectpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
