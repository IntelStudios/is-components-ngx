import { Component, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { cronExpressionValidator, mapNumbers } from './is-cron-editor.validator';

const cronValidator = cronExpressionValidator();

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'is-cron-editor',
  templateUrl: './is-cron-editor.component.html',
  styleUrls: ['./is-cron-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: IsCronEditorComponent,
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    useExisting: IsCronEditorComponent,
    multi: true
  }]
})
export class IsCronEditorComponent implements OnInit, ControlValueAccessor, Validator {

  constructor() {
  }

  formControl = {
    seconds: {
      type: new FormControl(),
      everyX: {
        everyX: new FormControl(),
        staringAt: new FormControl()
      },
      specific: new FormControl(),
      between: {
        start: new FormControl(),
        end: new FormControl()
      },
    },
    minutes: {
      type: new FormControl(),
      everyX: {
        everyX: new FormControl(),
        staringAt: new FormControl()
      },
      specific: new FormControl(),
      between: {
        start: new FormControl(),
        end: new FormControl()
      },
    },
    hours: {
      type: new FormControl(),
      everyX: {
        everyX: new FormControl(),
        staringAt: new FormControl()
      },
      specific: new FormControl(),
      between: {
        start: new FormControl(),
        end: new FormControl()
      },
    },
    days: {
      type: new FormControl(),
      everyX: {
        everyX: new FormControl(),
        staringAt: new FormControl()
      },
      everyXDay: {
        everyX: new FormControl(),
        staringAt: new FormControl()
      },
      specificDayOfWeek: new FormControl(),
      specificDayOfMonth: new FormControl(),
      lastDayOfWeekOfTheMonth: new FormControl(),
      XBeforeEnd: new FormControl(),
      nearestWeekdayTo: new FormControl(),
      XthDay: {
        x: new FormControl(),
        day: new FormControl()
      }
    },
    months: {
      type: new FormControl(),
      everyX: {
        everyX: new FormControl(),
        staringAt: new FormControl()
      },
      specific: new FormControl(),
      between: {
        start: new FormControl(),
        end: new FormControl()
      },
    },
    years: {
      type: new FormControl(),
      everyX: {
        everyX: new FormControl(),
        staringAt: new FormControl()
      },
      specific: new FormControl(),
      between: {
        start: new FormControl(),
        end: new FormControl()
      },
    },
  };

  cronExpressionControl = new FormControl();

  defaultSelectTypeValues = [
    { ID: 1, Value: 'Every' },
    { ID: 2, Value: 'Every X' },
    { ID: 4, Value: 'Every between' },
    { ID: 3, Value: 'Specific' },
  ];

  daySelectTypeValues = [
    { ID: 1, Value: 'Every' },
    { ID: 2, Value: 'Every weekday' },
    { ID: 3, Value: 'Every X days starting on day of week' },
    { ID: 4, Value: 'Every X days starting on Yth' },
    { ID: 5, Value: 'Specific day of week' },
    { ID: 12, Value: 'Specific day of month' },
    { ID: 6, Value: 'Any last day of the month' },
    { ID: 7, Value: 'Last weekday of the month' },
    { ID: 8, Value: 'Last day of week of the month' },
    { ID: 9, Value: 'X days before end of the moth' },
    { ID: 10, Value: 'Nearest weekday to the Xth of the month' },
    { ID: 11, Value: 'On the Xth day of the month' },
  ];

  values = {
    minutes: [],
    hours: [],
    years: [],
    daysOfMonth: [],

    daysOfWeek: [
      { ID: 2, Value: 'Monday' },
      { ID: 3, Value: 'Tuesday' },
      { ID: 4, Value: 'Wednesday' },
      { ID: 5, Value: 'Thursday' },
      { ID: 6, Value: 'Friday' },
      { ID: 7, Value: 'Saturday' },
      { ID: 1, Value: 'Sunday' },
    ],

    months: [
      { ID: 1, Value: 'January' },
      { ID: 2, Value: 'February' },
      { ID: 3, Value: 'March' },
      { ID: 4, Value: 'April' },
      { ID: 5, Value: 'May' },
      { ID: 6, Value: 'June' },
      { ID: 7, Value: 'July' },
      { ID: 8, Value: 'August' },
      { ID: 9, Value: 'September' },
      { ID: 10, Value: 'October' },
      { ID: 11, Value: 'November' },
      { ID: 12, Value: 'December' },
    ],
  };

  cronState = {
    seconds: '0',
    minutes: '0',
    hours: '*',
    dayOfMonth: '?',
    months: '*',
    dayOfWeek: '*',
    years: '*',
  };

  @Input() value: string;
  @Output() private valueChange = this.cronExpressionControl.valueChanges;

  onTouched: Function;
  private _changeSubscription: Subscription = null;
  private _value: string;
  private _ignore_reading = false;
  private validatorOnChangeFn: Function = null;

  ngOnInit() {
    for (let i = 0; i < 60; i++) {
      this.values.minutes.push({ ID: i, Value: `${i}` });
    }
    for (let i = 0; i < 24; i++) {
      this.values.hours.push({ ID: i, Value: `${i}` });
    }
    for (let i = 1; i <= 31; i++) {
      this.values.daysOfMonth.push({ ID: i, Value: `${i}` });
    }
    for (let i = (new Date()).getFullYear(); i < 2100; i++) {
      this.values.years.push({ ID: i, Value: `${i}` });
    }

    this.subscribeToForms();

    this.setDefaults();
    if (this.value) {
      this.writeValue(this.value);
    } else {
      this.readState();
    }

    this.cronExpressionControl.valueChanges.pipe(debounceTime(500)).subscribe((val) => this.parseState(val));
  }

  /**
   * Recursively subscribes to all form controls
   */
  subscribeToForms(dict = null) {
    dict = dict === null ? this.formControl : dict;
    Object.keys(dict).forEach(k => {
      const v = dict[k];
      if (v instanceof FormControl) {
        v.valueChanges.subscribe(() => this.readState());
      } else {
        this.subscribeToForms(v);
      }
    });
  }

  /**
   * Sets the default values for all forms, reseting it into it's default state
   */
  setDefaults() {
    this._ignore_reading = true;

    this.formControl.seconds.type.setValue(1);
    this.formControl.seconds.everyX.everyX.setValue(0);
    this.formControl.seconds.everyX.staringAt.setValue(0);
    this.formControl.seconds.specific.setValue(null);
    this.formControl.seconds.between.start.setValue(0);
    this.formControl.seconds.between.end.setValue(0);

    this.formControl.minutes.type.setValue(1);
    this.formControl.minutes.everyX.everyX.setValue(0);
    this.formControl.minutes.everyX.staringAt.setValue(0);
    this.formControl.minutes.specific.setValue(null);
    this.formControl.minutes.between.start.setValue(0);
    this.formControl.minutes.between.end.setValue(0);

    this.formControl.hours.type.setValue(1);
    this.formControl.hours.everyX.everyX.setValue(0);
    this.formControl.hours.everyX.staringAt.setValue(0);
    this.formControl.hours.specific.setValue(null);
    this.formControl.hours.between.start.setValue(0);
    this.formControl.hours.between.end.setValue(0);

    this.formControl.days.type.setValue(1);
    this.formControl.days.everyX.everyX.setValue(1);
    this.formControl.days.everyX.staringAt.setValue(1);
    this.formControl.days.specificDayOfWeek.setValue(null);
    this.formControl.days.specificDayOfMonth.setValue(null);
    this.formControl.days.everyXDay.everyX.setValue(1);
    this.formControl.days.everyXDay.staringAt.setValue(1);
    this.formControl.days.lastDayOfWeekOfTheMonth.setValue(1);
    this.formControl.days.XBeforeEnd.setValue(0);
    this.formControl.days.nearestWeekdayTo.setValue(1);
    this.formControl.days.XthDay.x.setValue(1);
    this.formControl.days.XthDay.day.setValue(1);

    this.formControl.months.type.setValue(1);
    this.formControl.months.everyX.everyX.setValue(1);
    this.formControl.months.everyX.staringAt.setValue(1);
    this.formControl.months.specific.setValue(null);
    this.formControl.months.between.start.setValue(1);
    this.formControl.months.between.end.setValue(1);

    const currentYear = (new Date()).getFullYear();
    this.formControl.years.type.setValue(1);
    this.formControl.years.everyX.everyX.setValue(1);
    this.formControl.years.everyX.staringAt.setValue(currentYear);
    this.formControl.years.specific.setValue(null);
    this.formControl.years.between.start.setValue(currentYear);
    this.formControl.years.between.end.setValue(currentYear + 1);

    this._ignore_reading = false;
  }

  /**
   * Reads current state of the cron from the forms
   */
  readState() {
    if (this._ignore_reading) {
      return;
    }

    switch (this.formControl.seconds.type.value) {
      case 1:
        this.cronState.seconds = '*';
        break;
      case 2:
        this.cronState.seconds = `${this.formControl.seconds.everyX.staringAt.value}/` +
          `${this.formControl.seconds.everyX.everyX.value}`;
        break;
      case 3:
        if (this.formControl.seconds.specific.value && this.formControl.seconds.specific.value.length) {
          this.cronState.seconds = this.formControl.seconds.specific.value.sort().map(v => `${v}`).join(',');
        } else {
          this.cronState.seconds = '0';
        }
        break;
      case 4:
        this.cronState.seconds = `${this.formControl.seconds.between.start.value}-${this.formControl.seconds.between.end.value}`;
        break;
    }

    switch (this.formControl.minutes.type.value) {
      case 1:
        this.cronState.minutes = '*';
        break;
      case 2:
        this.cronState.minutes = `${this.formControl.minutes.everyX.staringAt.value}/` +
          `${this.formControl.minutes.everyX.everyX.value}`;
        break;
      case 3:
        if (this.formControl.minutes.specific.value && this.formControl.minutes.specific.value.length) {
          this.cronState.minutes = this.formControl.minutes.specific.value.sort().map(v => `${v}`).join(',');
        } else {
          this.cronState.minutes = '0';
        }
        break;
      case 4:
        this.cronState.minutes = `${this.formControl.minutes.between.start.value}-${this.formControl.minutes.between.end.value}`;
        break;
    }

    switch (this.formControl.hours.type.value) {
      case 1:
        this.cronState.hours = '*';
        break;
      case 2:
        this.cronState.hours = `${this.formControl.hours.everyX.staringAt.value}/` +
          `${this.formControl.hours.everyX.everyX.value}`;
        break;
      case 3:
        if (this.formControl.hours.specific.value && this.formControl.hours.specific.value.length) {
          this.cronState.hours = this.formControl.hours.specific.value.sort().map(v => `${v}`).join(',');
        } else {
          this.cronState.hours = '0';
        }
        break;
      case 4:
        this.cronState.hours = `${this.formControl.hours.between.start.value}-${this.formControl.hours.between.end.value}`;
        break;
    }

    switch (this.formControl.days.type.value) {
      case 1:
        this.cronState.dayOfWeek = '*';
        this.cronState.dayOfMonth = '?';
        break;
      case 2:
        this.cronState.dayOfMonth = '?';
        this.cronState.dayOfWeek = 'MON-FRI';
        break;
      case 3:
        this.cronState.dayOfMonth = '?';
        this.cronState.dayOfWeek = `${this.formControl.days.everyXDay.staringAt.value}/${this.formControl.days.everyXDay.everyX.value}`;
        break;
      case 4:
        this.cronState.dayOfWeek = '?';
        this.cronState.dayOfMonth = `${this.formControl.days.everyX.staringAt.value}/${this.formControl.days.everyX.everyX.value}`;
        break;
      case 5:
        const mapIDtoShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        this.cronState.dayOfMonth = '?';
        if (this.formControl.days.specificDayOfWeek.value && this.formControl.days.specificDayOfWeek.value.length > 0) {
          this.cronState.dayOfWeek = this.formControl.days.specificDayOfWeek.value.sort().map(d => mapIDtoShort[d.ID - 1]).join(',');
        } else {
          this.cronState.dayOfWeek = mapIDtoShort[0];
        }
        break;
      case 12:
        this.cronState.dayOfWeek = '?';
        if (this.formControl.days.specificDayOfMonth.value && this.formControl.days.specificDayOfMonth.value.length) {
          this.cronState.dayOfMonth = this.formControl.days.specificDayOfMonth.value.sort().map(v => `${v}`).join(',');
        } else {
          this.cronState.dayOfMonth = '1';
        }
        break;
      case 6:
        this.cronState.dayOfWeek = '?';
        this.cronState.dayOfMonth = 'L';
        break;
      case 7:
        this.cronState.dayOfWeek = '?';
        this.cronState.dayOfMonth = 'LW';
        break;
      case 8:
        this.cronState.dayOfWeek = `${this.formControl.days.lastDayOfWeekOfTheMonth.value}L`;
        this.cronState.dayOfMonth = '?';
        break;
      case 9:
        this.cronState.dayOfWeek = '?';
        this.cronState.dayOfMonth = `L-${this.formControl.days.XBeforeEnd.value}`;
        break;
      case 10:
        this.cronState.dayOfWeek = '?';
        this.cronState.dayOfMonth = `${this.formControl.days.nearestWeekdayTo.value}W`;
        break;
      case 11:
        this.cronState.dayOfWeek = `${this.formControl.days.XthDay.day.value}#${this.formControl.days.XthDay.x.value}`;
        this.cronState.dayOfMonth = '?';
        break;
    }

    switch (this.formControl.months.type.value) {
      case 1:
        this.cronState.months = '*';
        break;
      case 2:
        this.cronState.months = `${this.formControl.months.everyX.staringAt.value}/` +
          `${this.formControl.months.everyX.everyX.value}`;
        break;
      case 3:
        const mapIDtoShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        if (this.formControl.months.specific.value && this.formControl.months.specific.value.length > 0) {
          this.cronState.months = this.formControl.months.specific.value.sort().map(m => mapIDtoShort[m.ID - 1]).join(',');
        } else {
          this.cronState.months = mapIDtoShort[0];
        }
        break;
      case 4:
        this.cronState.months = `${this.formControl.months.between.start.value}-${this.formControl.months.between.end.value}`;
        break;
    }

    switch (this.formControl.years.type.value) {
      case 1:
        this.cronState.years = '*';
        break;
      case 2:
        this.cronState.years = `${this.formControl.years.everyX.staringAt.value}/` +
          `${this.formControl.years.everyX.everyX.value}`;
        break;
      case 3:
        if (this.formControl.years.specific.value && this.formControl.years.specific.value.length) {
          this.cronState.years = this.formControl.years.specific.value.sort().map(v => `${v}`).join(',');
        } else {
          this.cronState.years = `${(new Date()).getFullYear()}`;
        }
        break;
      case 4:
        this.cronState.years = `${this.formControl.years.between.start.value}-${this.formControl.years.between.end.value}`;
        break;
    }

    this._value = Object.keys(this.cronState).map(k => this.cronState[k]).join(' ');
    if (this._value !== this.cronExpressionControl.value) {
      this.cronExpressionControl.setValue(this._value);
      if (this.validatorOnChangeFn) {
        this.validatorOnChangeFn();
      }
    }
  }

  /**
   * Parses the current state from the cron input string
   * @param state if not null, this state is parsed instead of the values inside cron text box
   */
  parseState(state: string = null) {
    if (!this.cronExpressionControl.value || this.cronExpressionControl.value === this._value) {
      return;
    }

    this._ignore_reading = true;

    try {
      const cronParts = (state !== null ? state : this.cronExpressionControl.value).split(' ');
      this.cronState.seconds = cronParts[0].trim();
      this.cronState.minutes = cronParts[1].trim();
      this.cronState.hours = cronParts[2].trim();
      this.cronState.dayOfMonth = cronParts[3].trim().toUpperCase();
      this.cronState.months = cronParts[4].trim().toUpperCase();
      this.cronState.dayOfWeek = cronParts[5].trim().toUpperCase();
      this.cronState.years = cronParts[6].trim();

      // parse seconds
      if (this.cronState.seconds === '*') {
        this.formControl.seconds.type.setValue(1);
      } else if (this.cronState.seconds.indexOf('/') > -1) {
        const split = mapNumbers(this.cronState.seconds.split('/'));

        this.formControl.seconds.everyX.everyX.setValue(split[1]);
        this.formControl.seconds.everyX.staringAt.setValue(split[0]);

        this.formControl.seconds.type.setValue(2);
      } else if (this.cronState.seconds.indexOf('-') > -1) {

        const split = mapNumbers(this.cronState.seconds.split('-'));
        this.formControl.seconds.between.start.setValue(split[0]);
        this.formControl.seconds.between.end.setValue(split[1]);

        this.formControl.seconds.type.setValue(4);
      } else {
        this.formControl.seconds.type.setValue(3);
        this.formControl.seconds.specific.setValue(mapNumbers(this.cronState.seconds.split(',')));
      }

      // parse minutes
      if (this.cronState.minutes === '*') {
        this.formControl.minutes.type.setValue(1);
      } else if (this.cronState.minutes.indexOf('/') > -1) {
        const split = mapNumbers(this.cronState.minutes.split('/'));

        this.formControl.minutes.everyX.everyX.setValue(split[1]);
        this.formControl.minutes.everyX.staringAt.setValue(split[0]);

        this.formControl.minutes.type.setValue(2);
      } else if (this.cronState.minutes.indexOf('-') > -1) {

        const split = mapNumbers(this.cronState.minutes.split('-'));
        this.formControl.minutes.between.start.setValue(split[0]);
        this.formControl.minutes.between.end.setValue(split[1]);

        this.formControl.minutes.type.setValue(4);
      } else {
        this.formControl.minutes.specific.setValue(mapNumbers(this.cronState.minutes.split(',')));

        this.formControl.minutes.type.setValue(3);
      }

      // parse hours
      if (this.cronState.hours === '*') {
        this.formControl.hours.type.setValue(1);
      } else if (this.cronState.hours.indexOf('/') > -1) {
        const split = mapNumbers(this.cronState.hours.split('/'));

        this.formControl.hours.everyX.everyX.setValue(split[1]);
        this.formControl.hours.everyX.staringAt.setValue(split[0]);

        this.formControl.hours.type.setValue(2);
      } else if (this.cronState.hours.indexOf('-') > -1) {

        const split = mapNumbers(this.cronState.hours.split('-'));
        this.formControl.hours.between.start.setValue(split[0]);
        this.formControl.hours.between.end.setValue(split[1]);

        this.formControl.hours.type.setValue(4);
      } else {
        this.formControl.hours.specific.setValue(mapNumbers(this.cronState.hours.split(',')));
        this.formControl.hours.type.setValue(3);
      }

      // parse days
      if (this.cronState.dayOfWeek === '*' && this.cronState.dayOfMonth === '?') {
        this.formControl.days.type.setValue(1);
      } else if (this.cronState.dayOfWeek === 'MON-FRI' && this.cronState.dayOfMonth === '?') {
        this.formControl.days.type.setValue(2);
      } else if (this.cronState.dayOfWeek.indexOf('/') > -1) {
        const split = mapNumbers(this.cronState.dayOfWeek.split('/'));

        this.formControl.days.everyXDay.everyX.setValue(split[1]);
        this.formControl.days.everyXDay.staringAt.setValue(split[0]);

        this.formControl.days.type.setValue(3);
      } else if (this.cronState.dayOfMonth.indexOf('/') > -1) {
        const split = mapNumbers(this.cronState.dayOfMonth.split('/'));

        this.formControl.days.everyX.everyX.setValue(split[1]);
        this.formControl.days.everyX.staringAt.setValue(split[0]);

        this.formControl.days.type.setValue(4);
      } else if (this.cronState.dayOfMonth === 'L') {
        this.formControl.days.type.setValue(6);
      } else if (this.cronState.dayOfMonth === 'LW') {
        this.formControl.days.type.setValue(7);
      } else if (this.cronState.dayOfWeek.endsWith('L')) {
        const dayNumber = mapNumbers([this.cronState.dayOfWeek.charAt(0)])[0];

        this.formControl.days.lastDayOfWeekOfTheMonth.setValue(dayNumber);
        this.formControl.days.type.setValue(8);
      } else if (this.cronState.dayOfMonth.startsWith('L-')) {
        const dayOffset = mapNumbers([this.cronState.dayOfMonth.substr(2)]);

        this.formControl.days.XBeforeEnd.setValue(dayOffset);
        this.formControl.days.type.setValue(9);
      } else if (this.cronState.dayOfMonth.endsWith('W')) {
        const day = mapNumbers([this.cronState.dayOfMonth.substr(0, this.cronState.dayOfMonth.length - 1)]);

        this.formControl.days.nearestWeekdayTo.setValue(day);
        this.formControl.days.type.setValue(10);
      } else if (this.cronState.dayOfWeek.indexOf('#') > -1) {
        const split = mapNumbers(this.cronState.dayOfWeek.split('#'));

        this.formControl.days.XthDay.day.setValue(split[0]);
        this.formControl.days.XthDay.x.setValue(split[1]);

        this.formControl.days.type.setValue(11);
      } else {
        if (this.cronState.dayOfWeek.length > this.cronState.dayOfMonth.length) {
          const mapIDtoShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

          const values = [];

          for (let day of this.cronState.dayOfWeek.split(',')) {
            day = day.trim();
            if (!day.length) {
              continue;
            }
            const dayIndex = mapIDtoShort.indexOf(day);
            if (dayIndex === -1) {
              // noinspection ExceptionCaughtLocallyJS
              throw Error('this day does not exist');
            }
            for (const dayOption of this.values.daysOfWeek) {
              if (dayOption.ID === dayIndex + 1) {
                values.push(dayOption);
                break;
              }
            }
          }

          this.formControl.days.type.setValue(5);
          this.formControl.days.specificDayOfWeek.setValue(values);
        } else {
          this.formControl.days.specificDayOfMonth.setValue(mapNumbers(this.cronState.dayOfMonth.split(',')));

          this.formControl.days.type.setValue(12);
        }
      }

      // parse month
      if (this.cronState.months === '*') {
        this.formControl.months.type.setValue(1);
      } else if (this.cronState.months.indexOf('/') > -1) {
        const split = mapNumbers(this.cronState.months.split('/'));

        this.formControl.months.everyX.everyX.setValue(split[1]);
        this.formControl.months.everyX.staringAt.setValue(split[0]);

        this.formControl.months.type.setValue(2);
      } else if (this.cronState.months.indexOf('-') > -1) {

        const split = mapNumbers(this.cronState.months.split('-'));
        this.formControl.months.between.start.setValue(split[0]);
        this.formControl.months.between.end.setValue(split[1]);

        this.formControl.months.type.setValue(4);
      } else {
        const mapIDtoShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const values = [];

        for (let month of this.cronState.months.split(',')) {
          month = month.trim();
          if (!month.length) {
            continue;
          }
          const monthIndex = mapIDtoShort.indexOf(month);
          if (monthIndex === -1) {
            // noinspection ExceptionCaughtLocallyJS
            throw Error('this month does not exist');
          }
          for (const monthOption of this.values.months) {
            if (monthOption.ID === monthIndex + 1) {
              values.push(monthOption);
              break;
            }
          }
        }

        this.formControl.months.type.setValue(3);
        this.formControl.months.specific.setValue(values);
      }

      // parse years
      if (this.cronState.years === '*') {
        this.formControl.years.type.setValue(1);
      } else if (this.cronState.years.indexOf('/') > -1) {
        const split = mapNumbers(this.cronState.years.split('/'));

        this.formControl.years.everyX.everyX.setValue(split[1]);
        this.formControl.years.everyX.staringAt.setValue(split[0]);

        this.formControl.years.type.setValue(2);
      } else if (this.cronState.years.indexOf('-') > -1) {

        const split = mapNumbers(this.cronState.years.split('-'));
        this.formControl.years.between.start.setValue(split[0]);
        this.formControl.years.between.end.setValue(split[1]);

        this.formControl.years.type.setValue(4);
      } else {
        this.formControl.years.specific.setValue(mapNumbers(this.cronState.years.split(',')));

        this.formControl.years.type.setValue(3);
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      if (this.validatorOnChangeFn) {
        this.validatorOnChangeFn();
      }
    }
    this._ignore_reading = false;
  }

  registerOnChange(fn: (_: any) => {}): void {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
    }
    this._changeSubscription = this.cronExpressionControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    function setDisabledRecursively(dict) {
      Object.keys(dict).forEach(k => {
        const v = dict[k];
        if (v instanceof FormControl) {
          isDisabled ? v.disable() : v.enable();
        } else {
          setDisabledRecursively(v);
        }
      });
    }

    setDisabledRecursively(this.formControl);
    isDisabled ? this.cronExpressionControl.disable() : this.cronExpressionControl.enable();
  }

  writeValue(cronExpression: string): void {
    this.cronExpressionControl.setValue(cronExpression);
    if (cronExpression) {
      this.parseState();
    } else {
      this._value = cronExpression;
      this.setDefaults();
    }
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorOnChangeFn = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return cronValidator(control);
  }

}
