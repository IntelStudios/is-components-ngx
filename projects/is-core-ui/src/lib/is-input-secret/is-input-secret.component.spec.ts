import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IsInputSecretComponent } from './is-input-secret.component';

describe('IsPasswordComponent', () => {
  let component: IsInputSecretComponent;
  let fixture: ComponentFixture<IsInputSecretComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IsInputSecretComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsInputSecretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
