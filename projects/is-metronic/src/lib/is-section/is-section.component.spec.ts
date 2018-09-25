import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsSectionComponent } from './is-section.component';

describe('IsSectionComponent', () => {
  let component: IsSectionComponent;
  let fixture: ComponentFixture<IsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
