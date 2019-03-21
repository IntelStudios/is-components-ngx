import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { IsSelectpickerComponent } from './is-selectpicker.component';
import { SelectPickerItem } from './is-selectpicker.interfaces';

export const IS_SELECTPICKER_BADGE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsSelectpickerBadgeComponent),
  multi: true
};

@Component({
  selector: 'is-selectpicker-badge',
  templateUrl: './is-selectpicker-badge.component.html',
  styleUrls: ['./is-selectpicker-badge.component.scss'],
  providers: [IS_SELECTPICKER_BADGE_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class IsSelectpickerBadgeComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Input()
  set options(opts: SelectPickerItem[]) {
    if (opts) {
      opts = opts.map((o: SelectPickerItem) => Object.assign({}, o));
    }

    if (opts && this.values && this.values.length > 0) {
      opts.forEach((o: SelectPickerItem) => {
        o.Object = this.values.findIndex(i => i.ID === o.ID) > -1;
      });

      this.updateValueText();
    }

    this._options = opts;

    this.changeDetector.detectChanges();
  }

  @Input()
  useModels: boolean = false;

  @Input()
  placeholder: string = '';

  @Input()
  xeStyle: boolean = false;

  @Input()
  showCaret: boolean = false;

  get options(): SelectPickerItem[] {
    return this._options;
  }

  @Output()
  changed: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('selectPicker')
  selectPicker: IsSelectpickerComponent;

  public values: SelectPickerItem[] = [];
  public valueText: string = '';

  private _options: SelectPickerItem[] = [];
  private _changeSubscription: Subscription = null;
  private onTouched: Function;

  private badgePattern: RegExp = new RegExp(/\[(\w+)_(.+?)\]/, 'g');

  constructor(private _eref: ElementRef, private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: any): void {
    this.values = value;

    if (this.options && this.values && this.values.length > 0) {
      this.options.forEach((o: SelectPickerItem) => {
        o.Object = this.values.findIndex(i => i.ID === o.ID) > -1;
      });
    }

    setTimeout(() => this.setValue());

    this.updateValueText();

    this.changeDetector.detectChanges();
  }

  /**
 * Implemented as part of ControlValueAccessor.
 */
  registerOnChange(fn: (_: any) => {}): void {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
    this._changeSubscription = this.changed.subscribe(fn);
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  setDisabledState(isDisabled: boolean): void {
    this.selectPicker.disabled = isDisabled;
    this.changeDetector.detectChanges();
  }

  valueChanged($event: any) {
    this.values = $event;

    this.updateValueText();
    this.changed.next(this.values);
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }

  parseBadge(value: string) {
    value = value.replace(this.badgePattern, (match: string, css: string, text: string) => {
      return `<span class="badge badge-${css.toLowerCase()} badge-roundless xe-badge">${text}</span>`;
    });

    return value;
  }

  private updateValueText() {
    if (this.values) {
      this.valueText = this.values.map((o: SelectPickerItem) => {
        if (this.useModels) {
          return o.Value;
        } else {
          return this.options.find(x=>String(x.ID) === String(o)).Value;
        }
      }).join(', ');
    } else {
      this.valueText = '';
    }
    this.changeDetector.detectChanges();
  }

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.selectPicker.rolesDropdown.isOpen = false;
      this.changeDetector.detectChanges();
    }
  }

  private setValue() {
    if (this.selectPicker && this._options) {
      this.selectPicker.writeValue(this.values);
    } else {
      //console.log('nemam select nebo items');
      //this.select.active = [];
    }

    this.changeDetector.markForCheck();
  }
}
