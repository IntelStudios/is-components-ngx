import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { FieldErrorModel } from './is-field-error.model';

@Component({
  selector: 'is-field-error',
  template: `<i *ngIf="isShown" class="fa fa-exclamation-triangle" [tooltip]="error" placement="right" container="body" containerClass="tooltip-field-error"></i><span *ngIf="isShown && !showOnlyIcon">{{error}}</span>`,
  styleUrls: ['./is-field-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsFieldErrorComponent implements OnInit, OnDestroy {

  @Input()
  field: FormControl;

  @Input()
  showOnlyIcon: boolean = false;

  private subStat: Subscription;
  private subVal: Subscription;

  isShown: boolean = false;

  error: string;

  constructor(private changeDetector: ChangeDetectorRef, public translate: TranslateService) {
  }

  ngOnInit() {
    this.subVal = this.field.valueChanges.subscribe(() => {
      this.detectChanges();
    });

    this.subStat = this.field.statusChanges.subscribe(() => {
      this.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subVal.unsubscribe();
    this.subStat.unsubscribe();
  }

  private detectChanges() {
    this.isShown = this.field.invalid && (this.field.touched || this.field.dirty);

    if (this.field.errors !== null) {
      let highestPriorityError: FieldErrorModel = null;
      Object.keys(this.field.errors).forEach((key) => {
        if (highestPriorityError === null || highestPriorityError.priority > this.field.errors[key].priority) {
          highestPriorityError = this.field.errors[key];
        }
      });
      if (highestPriorityError.message) {
        this.error = highestPriorityError.message;
      } else {
        const translated: string = this.translate.instant('field-error.' + highestPriorityError.key, highestPriorityError);

        if (translated !== 'field-error.' + highestPriorityError.key) {
          this.error = translated;
        } else {
          this.error = '';
        }
      }

    }
    this.changeDetector.detectChanges();
  }
}
