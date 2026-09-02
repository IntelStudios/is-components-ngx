import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { IsBreadcrumbBoxComponent } from './is-breadcrumb-box.component';

describe('IsBreadcrumbBoxComponent', () => {
  let component: IsBreadcrumbBoxComponent;
  let fixture: ComponentFixture<IsBreadcrumbBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsBreadcrumbBoxComponent],
      providers: [provideRouter([])],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsBreadcrumbBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
