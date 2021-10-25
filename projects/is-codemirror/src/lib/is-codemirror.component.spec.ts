import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IsCodemirrorComponent } from './is-codemirror.component';

describe('IsCodemirrorComponent', () => {
  let component: IsCodemirrorComponent;
  let fixture: ComponentFixture<IsCodemirrorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IsCodemirrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsCodemirrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
