import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IsCheckmapComponent } from './is-checkmap.component';

describe('IsCheckmapComponent', () => {
  let component: IsCheckmapComponent;
  let fixture: ComponentFixture<IsCheckmapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IsCheckmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsCheckmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
