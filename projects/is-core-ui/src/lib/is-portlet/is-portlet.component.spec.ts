import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IsPortletComponent } from './is-portlet.component';

describe('IsPortletComponent', () => {
  let component: IsPortletComponent;
  let fixture: ComponentFixture<IsPortletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IsPortletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsPortletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
