import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as m from 'moment';
import { Subscription } from 'rxjs';

const moment = m;

interface CalendarDate {
  day: number;
  month: number;
  year: number;
  enabled: boolean;
}

export const IS_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsDatepickerComponent),
  multi: true
};

@Component({
  selector: 'is-datepicker',
  templateUrl: './is-datepicker.component.html',
  styleUrls: ['./is-datepicker.component.scss'],
  providers: [IS_DATEPICKER_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsDatepickerComponent implements ControlValueAccessor, OnInit {
  public isOpened: boolean;
  public dateValue: string;
  public viewValue: string = '';
  public dayNames: Array<string>;

  disabled: boolean;
  @Input('modelFormat') modelFormat: string;
  @Input('viewFormat') viewFormat: string;
  @Input('initDate') initDate: string;
  @Input('firstWeekDaySunday') firstWeekDaySunday: boolean;
  @Input('isStatic') isStatic: boolean;
  @Input('isEOD') isEOD: boolean = false;
  @Input('isSOD') isSOD: boolean = false;
  @Input('placeholder') placeholder: string = '';

  @Output() changed: EventEmitter<Date> = new EventEmitter<Date>();

  days: Array<CalendarDate>;
  private el: any;
  private date: any;
  private _changeSubscription: Subscription = null;
  private onTouched: Function;
  private cannonical: number;

  constructor(private viewContainer: ViewContainerRef, private changeDetector: ChangeDetectorRef) {
    this.viewContainer = viewContainer;
    this.el = viewContainer.element.nativeElement;
  }

  ngOnInit() {
    this.isOpened = false;
    this.date = moment.utc();
    this.firstWeekDaySunday = false;
    this.generateDayNames();
    this.generateCalendar(this.date);
    this.initMouseEvents();
  }

  public openDatepicker(): void {
    this.isOpened = true;
    this.changeDetector.detectChanges();
  }

  public toggleDatepicker(): void {
    if (!this.disabled) {
      this.isOpened = !this.isOpened;
      this.changeDetector.detectChanges();
    }
  }

  public closeDatepicker(): void {
    this.isOpened = false;
    this.changeDetector.detectChanges();
  }

  public prevYear(): void {
    this.date.subtract(1, 'Y');
    this.generateCalendar(this.date);
  }

  public prevMonth(): void {
    this.date.subtract(1, 'M');
    this.generateCalendar(this.date);
  }

  public nextYear(): void {
    this.date.add(1, 'Y');
    this.generateCalendar(this.date);
  }

  public nextMonth(): void {
    this.date.add(1, 'M');
    this.generateCalendar(this.date);
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: string): void {
    if (!value) {
      this.dateValue = null;
      this.cannonical = null;
      this.viewValue = '';

      this.changeDetector.markForCheck();

      return;
    };

    this.setValue(value);
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
    this.disabled = isDisabled;
    this.changeDetector.markForCheck();
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }

  selectDate(e: MouseEvent, date: CalendarDate): void {
    e.preventDefault();
    if (this.isSelected(date)) {
      this.closeDatepicker();
      this.changeDetector.detectChanges();
      return;
    }

    let selectedDate = moment.utc(date.day + '.' + date.month + '.' + date.year, 'DD.MM.YYYY');
    this.setValue(selectedDate);
    this.closeDatepicker();
    if (this.isEOD) {
      selectedDate.set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
    } else if (this.isSOD) {
      selectedDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    }
    this.changed.emit(selectedDate.toDate());
    this.changeDetector.detectChanges();
  }

  protected initValue(): void {
    setTimeout(() => {
      if (!this.initDate) {
        this.setValue(moment().format(this.modelFormat || 'YYYY-MM-DD'));
      } else {
        this.setValue(moment.utc(this.initDate, this.modelFormat || 'YYYY-MM-DD'));
      }
    });
  }

  private generateCalendar(date: any): void {
    let lastDayOfMonth = date.endOf('month').date();
    let month = date.month();
    let year = date.year();
    let n = 1;
    let firstWeekDay: number = null;

    this.dateValue = date.format('MMMM YYYY');
    this.days = [];

    if (this.firstWeekDaySunday === true) {
      firstWeekDay = date.set('date', 2).day();
    } else {
      firstWeekDay = date.set('date', 1).day();
    }

    if (firstWeekDay !== 1) {
      n -= (firstWeekDay + 6) % 7;
    }

    for (let i = n; i <= lastDayOfMonth; i += 1) {
      if (i > 0) {
        this.days.push({ day: i, month: month + 1, year: year, enabled: true });
      } else {
        this.days.push({ day: null, month: null, year: null, enabled: false });
      }
    }
    this.changeDetector.detectChanges();
  }

  isSelected(date: CalendarDate) {
    let selectedDate = moment.utc(date.day + '.' + date.month + '.' + date.year, 'DD.MM.YYYY');
    return selectedDate.toDate().getTime() === this.cannonical;
  }

  public isToday(date: CalendarDate) {
    const today: Date = new Date();
    let selectedDate = moment.utc(date.day + '.' + date.month + '.' + date.year, 'DD.MM.YYYY');
    return selectedDate.toDate().toDateString() === today.toDateString();
  }

  private generateDayNames(): void {
    this.dayNames = [];
    let date = this.firstWeekDaySunday === true ? moment.utc('2015-06-07') : moment.utc('2015-06-01');
    for (let i = 0; i < 7; i += 1) {
      this.dayNames.push(date.format('ddd'));
      date.add('1', 'd');
    }
  }

  private initMouseEvents(): void {
    let body = document.getElementsByTagName('body')[0];

    body.addEventListener('click', (e) => {
      if (!this.isOpened || !e.target) return;
      if (this.el !== e.target && !this.el.contains(e.target)) {
        this.closeDatepicker();
      }
    }, false);
  }

  private setValue(value: any): void {
    if (value) {
      let val = moment.utc(value, this.modelFormat || 'YYYY-MM-DD');
      this.viewValue = val.format(this.viewFormat || 'Do MMMM YYYY');
      this.cannonical = val.toDate().getTime();
      this.changeDetector.markForCheck();
    }
  }
}
