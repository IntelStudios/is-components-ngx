import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IsSearchComponent } from './is-search.component';

describe('IsSearchComponent', () => {
  let component: IsSearchComponent;
  let fixture: ComponentFixture<IsSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
