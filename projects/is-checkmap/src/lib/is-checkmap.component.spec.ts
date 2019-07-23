import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsCheckmapComponent } from './is-checkmap.component';

describe('IsCheckmapComponent', () => {
  let component: IsCheckmapComponent;
  let fixture: ComponentFixture<IsCheckmapComponent>;

  beforeEach(async(() => {
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
