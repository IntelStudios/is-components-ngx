import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsCodemirrorComponent } from './is-codemirror.component';

describe('IsCodemirrorComponent', () => {
  let component: IsCodemirrorComponent;
  let fixture: ComponentFixture<IsCodemirrorComponent>;

  beforeEach(async(() => {
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
