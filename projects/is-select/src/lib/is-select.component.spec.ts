import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsSelectComponent } from './is-select.component';

describe('IsSelectComponent', () => {
  let component: IsSelectComponent;
  let fixture: ComponentFixture<IsSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
