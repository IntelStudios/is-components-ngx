import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsInputSecretComponent } from './is-input-secret.component';

describe('IsPasswordComponent', () => {
  let component: IsInputSecretComponent;
  let fixture: ComponentFixture<IsInputSecretComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IsInputSecretComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsInputSecretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
