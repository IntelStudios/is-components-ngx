import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IscmTreeNodeComponent } from './iscm-tree-node.component';

describe('IscmTreeNodeComponent', () => {
  let component: IscmTreeNodeComponent;
  let fixture: ComponentFixture<IscmTreeNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IscmTreeNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IscmTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
