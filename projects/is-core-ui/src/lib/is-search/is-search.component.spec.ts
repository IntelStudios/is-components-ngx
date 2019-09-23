import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsSearchComponent } from './is-search.component';

describe('IsSearchComponent', () => {
  let component: IsSearchComponent;
  let fixture: ComponentFixture<IsSearchComponent>;

  beforeEach(async(() => {
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
