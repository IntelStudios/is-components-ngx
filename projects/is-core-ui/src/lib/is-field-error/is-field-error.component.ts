import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, merge } from 'rxjs';

import { configToken, IsCoreUIConfig } from '../is-core-ui.interfaces';
import { IsFieldError } from './is-field-error.model';

@Component({
  selector: 'is-field-error',
  templateUrl: './is-field-error.component.html',
  styleUrls: ['./is-field-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsFieldErrorComponent implements OnInit, OnDestroy {

/**
 * Attach a FormControl to listen on status/value changes and display correct error
 */
  @Input()
  set control(value: FormControl) {
    this._control= value;
    if (value) {
      this.unbindControl();
      this.bindControl();
    }
  }
  get control(): FormControl {
    return this._control;
  }

  private _control: FormControl;

  /**
   * set wheather this component will appear as Icon (default) or Icon + error message
   */
  @Input()
  iconOnly: boolean = true;

  /**
   * tooltip placement (see ngx-bootstrap tooltip/popover placement)
   */
  @Input()
  tooltipPlacement: string = 'top';

  /**
   * Error text to be displayed. This property is exclusive with [control]
   */
  @Input()
  error: string;

  isShown: boolean = false;
  private translationPrefix: string = 'field-error.';
  private _sub: Subscription;

  constructor(@Optional() @Inject(configToken) coreUiConfig: IsCoreUIConfig, private changeDetector: ChangeDetectorRef, public translate: TranslateService) {
    if(coreUiConfig && coreUiConfig.fieldErrorConfig) {
      this.translationPrefix = coreUiConfig.fieldErrorConfig.translationPrefix;
    }
  }

  ngOnInit() {
    if (!this.control && this.error) {
      this.isShown = true;
    }
  }

  ngOnDestroy() {
    this.unbindControl();
  }

  private bindControl() {
    this._sub = merge(this.control.valueChanges, this.control.statusChanges)
      .subscribe(() => {
        this.detectChanges();
      });
    this.detectChanges();
  }

  private unbindControl() {
    if (this._sub) {
      this._sub.unsubscribe();
      this._sub = null;
    }
  }

  private detectChanges() {
    this.isShown = this.control.invalid; // && (this.control.touched || this.control.dirty);

    if (this.control.errors !== null) {
      let highestPriorityError: IsFieldError = null;
      Object.keys(this.control.errors).forEach((key) => {
        if (highestPriorityError === null || highestPriorityError.priority > this.control.errors[key].priority) {
          highestPriorityError = this.control.errors[key];
        }
      });
      const key = this.translationPrefix + highestPriorityError.key;
      const translated: string = this.translate.instant(key, highestPriorityError.params);

      if (translated !== key) {
        this.error = translated;
      } else {
        this.error = highestPriorityError.message || '';
      }
    }
    this.changeDetector.detectChanges();
  }
}
