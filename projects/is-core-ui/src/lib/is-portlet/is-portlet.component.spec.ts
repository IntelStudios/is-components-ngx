import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

import { IsPortletComponent } from './is-portlet.component';

describe('IsPortletComponent', () => {
  let component: IsPortletComponent;
  let fixture: ComponentFixture<IsPortletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IsPortletComponent],
      imports: [NoopAnimationsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsPortletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
