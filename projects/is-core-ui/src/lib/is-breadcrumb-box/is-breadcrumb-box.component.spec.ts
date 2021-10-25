import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IsBreadcrumbBoxComponent } from './is-breadcrumb-box.component';

describe('IsBreadcrumbBoxComponent', () => {
  let component: IsBreadcrumbBoxComponent;
  let fixture: ComponentFixture<IsBreadcrumbBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IsBreadcrumbBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsBreadcrumbBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
