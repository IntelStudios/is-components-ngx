import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsPasswordComponent } from './is-password.component';

describe('IsPasswordComponent', () => {
  let component: IsPasswordComponent;
  let fixture: ComponentFixture<IsPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IsPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
