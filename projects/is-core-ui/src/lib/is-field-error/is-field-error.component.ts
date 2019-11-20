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
import { Subscription } from 'rxjs';

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
  control: FormControl;

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

  // @Output()
  // changed: EventEmitter<any> = new EventEmitter<any>();

  // private onTouched: Function;

  // private _changeSubscription: Subscription = null;

  isShown: boolean = false;

  /**
   * Error text to be displayed. This property is exclusive with [control]
   */
  @Input()
  error: string;

  private translationPrefix: string = 'field-error.';
  private subStat: Subscription;
  private subVal: Subscription;

  constructor(@Optional() @Inject(configToken) coreUiConfig: IsCoreUIConfig, private changeDetector: ChangeDetectorRef, public translate: TranslateService) {
    if(coreUiConfig && coreUiConfig.fieldErrorConfig) {
      this.translationPrefix = coreUiConfig.fieldErrorConfig.translationPrefix;
    }
  }

  ngOnInit() {
    if (this.control) {
      this.detectChanges();
      this.subVal = this.control.valueChanges.subscribe(() => {
        this.detectChanges();
      });

      this.subStat = this.control.statusChanges.subscribe(() => {
        this.detectChanges();
      });
    } else if (this.error) {
      this.isShown = true;
    }
  }

  // /**
  // * Implemented as part of ControlValueAccessor.
  // */
  // writeValue(value: any): void {
  //   console.log("[Is-FieldError Component] Write value: ", value);

  //   this.changeDetector.detectChanges();
  // }

  // registerOnChange(fn: (_: any) => {}): void {
  //   if (this._changeSubscription) {
  //     this._changeSubscription.unsubscribe();
  //   }
  //   this._changeSubscription = this.changed.subscribe(fn);
  // }

  // registerOnTouched(fn: (_: any) => {}): void {
  //   this.onTouched = fn;
  // }

  ngOnDestroy() {
    if (this.subVal) {
      this.subVal.unsubscribe();
    }
    if (this.subStat) {
      this.subStat.unsubscribe();
    }

    // if (this._changeSubscription) {
    //   this._changeSubscription.unsubscribe();
    // }
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
