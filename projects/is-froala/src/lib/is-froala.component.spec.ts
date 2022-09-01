import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IsFroalaComponent } from './is-froala.component';
import { IsFroalaService } from './is-froala.service';

describe('IsFroalaComponent', () => {
  let component: IsFroalaComponent;
  let fixture: ComponentFixture<IsFroalaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IsFroalaComponent],
      providers: [IsFroalaService],
      imports: [TranslateModule.forRoot()],
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
