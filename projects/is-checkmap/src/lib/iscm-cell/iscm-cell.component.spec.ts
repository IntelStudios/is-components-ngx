import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IscmCellComponent } from './iscm-cell.component';

describe('IscmCellComponent', () => {
  let component: IscmCellComponent;
  let fixture: ComponentFixture<IscmCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IscmCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IscmCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
