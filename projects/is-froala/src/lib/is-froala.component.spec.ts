import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsFroalaComponent } from './is-froala.component';

describe('IsFroalaComponent', () => {
  let component: IsFroalaComponent;
  let fixture: ComponentFixture<IsFroalaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsFroalaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsFroalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
