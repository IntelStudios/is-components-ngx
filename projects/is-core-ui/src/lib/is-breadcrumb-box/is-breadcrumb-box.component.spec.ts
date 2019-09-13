import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsBreadcrumbBoxComponent } from './is-breadcrumb-box.component';

describe('IsBreadcrumbBoxComponent', () => {
  let component: IsBreadcrumbBoxComponent;
  let fixture: ComponentFixture<IsBreadcrumbBoxComponent>;

  beforeEach(async(() => {
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
