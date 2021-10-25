import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IscmTreeComponent } from './iscm-tree.component';

describe('IscmTreeComponent', () => {
  let component: IscmTreeComponent;
  let fixture: ComponentFixture<IscmTreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IscmTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IscmTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
