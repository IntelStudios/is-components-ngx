import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IscmCellComponent } from './iscm-cell.component';

describe('IscmCellComponent', () => {
  let component: IscmCellComponent;
  let fixture: ComponentFixture<IscmCellComponent>;

  beforeEach(waitForAsync(() => {
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
