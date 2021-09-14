import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { IsColorItem } from '../is-select.interfaces';
import { IsSelectComponent } from '../is-select/is-select.component';


const NONE_COLOR = { 'ID': null, 'Value': 'None', Object: '#fff' };

const DEFAULT_COLORS: IsColorItem[] = [NONE_COLOR, {"ID":"blue","Value":"blue","Object":"#3598dc"},{"ID":"blue-hoki","Value":"blue-hoki","Object":"#67809f"},{"ID":"blue-steel","Value":"blue-steel","Object":"#4b77be"},{"ID":"blue-madison","Value":"blue-madison","Object":"#578ebe"},{"ID":"blue-chamray","Value":"blue-chamray","Object":"#2c3e50"},{"ID":"blue-ebonyclay","Value":"blue-ebonyclay","Object":"#22313f"},{"ID":"green","Value":"green","Object":"#32c5d2"},{"ID":"green-meadow","Value":"green-meadow","Object":"#1bbc9b"},{"ID":"green-seagreen","Value":"green-seagreen","Object":"#1ba39c"},{"ID":"green-turquoise","Value":"green-turquoise","Object":"#36d7b7"},{"ID":"green-haze","Value":"green-haze","Object":"#44b6ae"},{"ID":"green-jungle","Value":"green-jungle","Object":"#26c281"},{"ID":"red","Value":"red","Object":"#e7505a"},{"ID":"red-pink","Value":"red-pink","Object":"#e08283"},{"ID":"red-sunglo","Value":"red-sunglo","Object":"#e26a6a"},{"ID":"red-intense","Value":"red-intense","Object":"#e35b5a"},{"ID":"red-thunderbird","Value":"red-thunderbird","Object":"#d91e18"},{"ID":"red-flamingo","Value":"red-flamingo","Object":"#ef4836"},{"ID":"yellow","Value":"yellow","Object":"#c49f47"},{"ID":"yellow-gold","Value":"yellow-gold","Object":"#e87e04"},{"ID":"yellow-casablanca","Value":"yellow-casablanca","Object":"#f2784b"},{"ID":"yellow-crusta","Value":"yellow-crusta","Object":"#f3c200"},{"ID":"yellow-lemon","Value":"yellow-lemon","Object":"#f7ca18"},{"ID":"yellow-saffron","Value":"yellow-saffron","Object":"#f4d03f"},{"ID":"purple","Value":"purple","Object":"#8e44ad"},{"ID":"purple-plum","Value":"purple-plum","Object":"#8775a7"},{"ID":"purple-medium","Value":"purple-medium","Object":"#bf55ec"},{"ID":"purple-studio","Value":"purple-studio","Object":"#8e44ad"},{"ID":"purple-wisteria","Value":"purple-wisteria","Object":"#9b59b6"},{"ID":"purple-seance","Value":"purple-seance","Object":"#9a12b3"},{"ID":"grey","Value":"grey","Object":"#e5e5e5"},{"ID":"grey-cascade","Value":"grey-cascade","Object":"#95a5a6"},{"ID":"grey-sliver","Value":"grey-sliver","Object":"#bfbfbf"},{"ID":"grey-steel","Value":"grey-steel","Object":"#e9edef"},{"ID":"grey-carara","Value":"grey-carara","Object":"#fafafa"},{"ID":"grey-gallery","Value":"grey-gallery","Object":"#555"},{"ID":"white","Value":"white","Object":"#ffffff"}];

export const IS_SELECT_COLOR_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsSelectColorComponent),
  multi: true
};

@Component({
  selector: 'is-select-color',
  templateUrl: './is-select-color.component.html',
  providers: [IS_SELECT_COLOR_CONTROL_VALUE_ACCESSOR],
  styleUrls: ['./is-select-color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsSelectColorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

  @Input('readOnly')
  disabled: boolean;

  @Input()
  showLabel: boolean = true;

  @Input()
  allowClear: boolean;

  @Input()
  multiple: boolean = false;

  @Input()
  placeholder: string = 'None';

  @Input()
  closeOptionsOnScroll: boolean = false;

  @Input()
  set value(value: any) {
    this._value = value;
    this.setValue();
  }
  get value(): any {
    return this._value;
  }

  @Input()
  set items(items: IsColorItem[]) {
    if (!items || items.length === 0) {
      return;
    }
    this._items = items;
    if (String(this._value)) {
      this.setValue();
    }
  }

  get items(): IsColorItem[] {
    return this._items;
  }

  @Output()
  valueChange: EventEmitter<any> = new EventEmitter<any>();


  @ViewChild('select', { static: true })
  select: IsSelectComponent;

  @Input()
  isSearch = true;

  private _items: IsColorItem[] = DEFAULT_COLORS;

  private _value: any;
  //private fieldId: string = 'xx';
  private _changeSubscription: { unsubscribe: () => any } = null;
  /** Called when the combo is blurred. Needed to properly implement ControlValueAccessor. */
  onTouched: () => any = () => { return; };

  constructor(private changeDetector: ChangeDetectorRef, private sanitizer: DomSanitizer) {
    return;
  }

  ngOnDestroy() {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    return;
  }

  styleContent() {
    const classes = this.items.map(i => `.is-bg-${i.ID} {background-color: ${i.Object};}`)
    const style = `<style>${classes.join(' ')}</style>`;
    return this.sanitizer.bypassSecurityTrustHtml(style);
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: any) {
    this._value = value;
    setTimeout(() => this.setValue());
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnChange(fn: any) {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
    this._changeSubscription = <{ unsubscribe: () => any }>this.valueChange.subscribe(fn);
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetector.markForCheck();
  }

  onValueChanged($event: any) {
    if ($event === null) { // cleared
      this._value = null;
      this.valueChange.next(this.value);
      return;
    }
    this._value = $event;
    if (this.multiple) {
      this.valueChange.next($event.map((i: any) => i.ID));
    } else if ($event === []) {
      this.valueChange.next(null);
    } else {
      if (String(Number(this.value)) !== String(this.value) || this.value === ' ') {
        this.valueChange.next(this.value);
      } else {
        this.valueChange.next(Number(this.value));
      }
    }
    this.changeDetector.markForCheck();
  }

  private setValue() {
    if (this.select && this._items) {
      // need to type to string as select2 cannot work with 0
      if (String(this._value)) {
        const val = this._items.find((item: any) => String(item.ID) === String(this._value));
        //console.log(this.fieldId, this.value, val);
        if (val) {
          //console.log('selecting', this.fieldId, val);
          this.select.writeValue(this._value);
        } else {
          //console.log('value not found? ', this.fieldId, this.value);
          this.select.writeValue(null);
        }

      } else {
        //console.log('clearing', this.fieldId, this.value, this._items);
        this.select.writeValue(null);
      }

    } else {
      //console.log('nemam select nebo items');
      //this.select.active = [];
    }

    this.changeDetector.markForCheck();
  }
}
