import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  HostBinding,
  ViewChild,
  Renderer2
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IsFieldErrorFactory } from '@intelstudios/cdk';
import { TranslateService } from '@ngx-translate/core';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { AvailbleBSPositions } from 'ngx-bootstrap/positioning';
import { Subscription, merge, of } from 'rxjs';

import { configToken, IsCoreUIConfig } from '../is-core-ui.interfaces';

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
    this._control = value;
    if (value) {
      this.unbindControl();
      this.bindControl();
    }
  }
  get control(): FormControl {
    return this._control;
  }

  private _control: FormControl;

  @Input()
  faIcon = 'fas fa-fw fa-exclamation-triangle';
  /**
   * set wheather this component will appear as Icon (default) or Icon + error message
   */
  @Input()
  iconOnly: boolean = true;

  /**
   * Instantly display tooltip error (so user does not need to hover)
   * applies only in [iconOnly]="true" mode
   */
  @Input()
  instantTooltip = false;

  /**
   * tooltip placement (see ngx-bootstrap tooltip/popover placement)
   */
  @Input()
  tooltipPlacement: AvailbleBSPositions = 'top';

  /**
   * Error text to be displayed. This property is exclusive with [control]
   */
  @Input()
  error: string;

  isShown: boolean = false;

  @ViewChild('tooltip')
  tooltip: PopoverDirective;

  private transPrefix: string = 'field-error.';
  private _sub: Subscription;

  constructor(@Optional() @Inject(configToken) coreUiConfig: IsCoreUIConfig,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2,
    private translate: TranslateService) {
    if (coreUiConfig && coreUiConfig.fieldErrorConfig) {
      this.transPrefix = coreUiConfig.fieldErrorConfig.translationPrefix;
    }
    this.hideTooltipOnClick = this.hideTooltipOnClick.bind(this);
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
    this._sub = merge(this.control.valueChanges, this.control.statusChanges, of(this.control.status))
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
    document.removeEventListener('click', this.hideTooltipOnClick);
  }

  private detectChanges() {
    this.isShown = this.control.invalid; // && (this.control.touched || this.control.dirty);

    const errs: string[] = IsFieldErrorFactory.getErrors(this.control, this.transPrefix, this.translate);
    this.error = errs[0];

    this.cd.detectChanges();

    if (this.isShown && this.iconOnly && this.instantTooltip) {
      setTimeout(() => {
        if (this.tooltip) {
          this.tooltip.show();
          document.addEventListener('click', this.hideTooltipOnClick, { once: true, passive: true });
        }
      });
    }
  }

  private hideTooltipOnClick() {
    this.tooltip?.hide();
  }
}
