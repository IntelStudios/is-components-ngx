import {Component, Input, OnInit, Output} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn
} from '@angular/forms';
import {Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {cronExpressionValidator, mapNumbers} from './is-cron-editor.validator';
import { CronState } from './is-cron-editor.models';

// noinspection DuplicatedCode
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
  get allowRandom(): boolean {
    return this._allowRandom;
  }

  /**
   * If set to true, assigning random extension values such as R(10-20) is allowed
   */
  @Input()
  set allowRandom(value: boolean) {
    this._allowRandom = value;
    this.setRandomAbleValues();
  }

  private _allowRandom = false;


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
      between: {
        start: new FormControl(1),
        end: new FormControl(31)
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

  _defaultSelectTypeValues = [
    {ID: 1, Value: 'Every'},
    {ID: 2, Value: 'Every X'},
    {ID: 4, Value: 'Every between'},
    {ID: 3, Value: 'Specific'},
  ];

  defaultSelectTypeValues: { ID: number, Value: string }[];

  randomAbleSelectTypeValues: { ID: number, Value: string }[];

  _daySelectTypeValues = [
    {ID: 1, Value: 'Every'},
    {ID: 2, Value: 'Every weekday'},
    {ID: 15, Value: 'Every day of month between'},
    {ID: 16, Value: 'Every day of week between'},
    {ID: 3, Value: 'Every X days starting on day of week'},
    {ID: 4, Value: 'Every X days starting on Yth'},
    {ID: 14, Value: 'Specific day of week'},
    {ID: 12, Value: 'Specific day of month'},
    {ID: 13, Value: 'Any last day of the month'},
    {ID: 7, Value: 'Last weekday of the month'},
    {ID: 8, Value: 'Last day of week of the month'},
    {ID: 9, Value: 'X days before end of the moth'},
    {ID: 10, Value: 'Nearest weekday to the Xth of the month'},
    {ID: 11, Value: 'On the Xth day of the month'},
  ];

  daySelectTypeValues: { ID: number, Value: string }[];

  values = {
    minutes: [],
    hours: [],
    years: [],
    daysOfMonth: [],

    daysOfWeek: [
      {ID: 2, Value: 'Monday'},
      {ID: 3, Value: 'Tuesday'},
      {ID: 4, Value: 'Wednesday'},
      {ID: 5, Value: 'Thursday'},
      {ID: 6, Value: 'Friday'},
      {ID: 7, Value: 'Saturday'},
      {ID: 1, Value: 'Sunday'},
    ],

    months: [
      {ID: 1, Value: 'January'},
      {ID: 2, Value: 'February'},
      {ID: 3, Value: 'March'},
      {ID: 4, Value: 'April'},
      {ID: 5, Value: 'May'},
      {ID: 6, Value: 'June'},
      {ID: 7, Value: 'July'},
      {ID: 8, Value: 'August'},
      {ID: 9, Value: 'September'},
      {ID: 10, Value: 'October'},
      {ID: 11, Value: 'November'},
      {ID: 12, Value: 'December'},
    ],
  };

  cronState: CronState = {
    seconds: '0',
    minutes: '0',
    hours: '*',
    dayOfMonth: '?',
    months: '*',
    dayOfWeek: '*',
    years: '*',
  };

  cronValidator: ValidatorFn = cronExpressionValidator();

  @Input() value: string;
  @Output() private valueChange = this.cronExpressionControl.valueChanges;

  /**
   * By setting a fixed state to a defined value, every defined member of the value will be required to match the cron state.
   * If fixed state is not the same as current state then validation error is raised.
   * @param value undefined to disable, pass a CronState object to set required values for every field
   * @example
   * fixedState = {minutes: '0'} // will fail validation of minutes is set to anything other than '0', seconds can be anything
   */
  @Input()
  set fixedState(value: CronState | undefined) {
    this._fixedState = value;
    this.cronValidator = cronExpressionValidator(this._allowRandom, value);
    if (this.validatorOnChangeFn) {
      this.validatorOnChangeFn();
    }
  }

  get fixedState(): CronState | undefined {
    return this._fixedState;
  }

  onTouched: Function;
  private _changeSubscription: Subscription = null;
  private _value: string;
  private _ignore_reading = false;
  private validatorOnChangeFn: Function = null;
  private _fixedState?: CronState;

  ngOnInit() {
    for (let i = 0; i < 60; i++) {
      this.values.minutes.push({ID: i, Value: `${i}`});
    }
    for (let i = 0; i < 24; i++) {
      this.values.hours.push({ID: i, Value: `${i}`});
    }
    for (let i = 1; i <= 31; i++) {
      this.values.daysOfMonth.push({ID: i, Value: `${i}`});
    }
    for (let i = (new Date()).getFullYear(); i < 2100; i++) {
      this.values.years.push({ID: i, Value: `${i}`});
    }

    this.setRandomAbleValues();

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
      case 5:
        this.cronState.seconds = 'R';
        break;
      case 6:
        this.cronState.seconds = `R(${this.formControl.seconds.between.start.value}-${this.formControl.seconds.between.end.value})`;
        if (this.formControl.seconds.everyX.staringAt.value > 0) {
          this.cronState.seconds = `${this.formControl.seconds.everyX.staringAt.value}/` + this.cronState.seconds;
        }
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
      case 5:
        this.cronState.minutes = 'R';
        break;
      case 6:
        this.cronState.minutes = `R(${this.formControl.minutes.between.start.value}-${this.formControl.minutes.between.end.value})`;
        if (this.formControl.minutes.everyX.staringAt.value > 0) {
          this.cronState.minutes = `${this.formControl.minutes.everyX.staringAt.value}/` + this.cronState.minutes;
        }
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
      case 6:
        this.cronState.hours = `R(${this.formControl.hours.between.start.value}-${this.formControl.hours.between.end.value})`;
        if (this.formControl.hours.everyX.staringAt.value > 0) {
          this.cronState.hours = `${this.formControl.hours.everyX.staringAt.value}/` + this.cronState.hours;
        }
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
      case 6:
        this.cronState.dayOfMonth = `R(${this.formControl.days.between.start.value}-${this.formControl.days.between.end.value})`;
        if (this.formControl.days.everyX.staringAt.value > 0) {
          this.cronState.dayOfMonth = `${this.formControl.days.everyX.staringAt.value}/` + this.cronState.dayOfMonth;
        }
        break;
      case 14:
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
      case 13:
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
      case 15:
        this.cronState.dayOfMonth = `${this.formControl.days.between.start.value}-${this.formControl.days.between.end.value}`;
        if (this.formControl.days.everyX.staringAt.value > 0) {
          this.cronState.dayOfMonth = `${this.formControl.days.everyX.staringAt.value}/${this.cronState.dayOfMonth}`;
        }
        this.cronState.dayOfWeek = '?';
        break;
      case 16:
        this.cronState.dayOfWeek = `${this.formControl.days.between.start.value}-${this.formControl.days.between.end.value}`;
        if (this.formControl.days.everyX.staringAt.value > 0) {
          this.cronState.dayOfWeek = `${this.formControl.days.everyX.staringAt.value}/${this.cronState.dayOfWeek}`;
        }
        this.cronState.dayOfMonth = '?';
        break;
      case 17:
        this.cronState.dayOfWeek = `R(${this.formControl.days.between.start.value}-${this.formControl.days.between.end.value})`;
        if (this.formControl.days.everyX.staringAt.value > 0) {
          this.cronState.dayOfWeek = `${this.formControl.days.everyX.staringAt.value}/${this.cronState.dayOfWeek}`;
        }
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
      case 6:
        this.cronState.months = `R(${this.formControl.months.between.start.value}-${this.formControl.months.between.end.value})`;
        if (this.formControl.months.everyX.staringAt.value > 0) {
          this.cronState.months = `${this.formControl.months.everyX.staringAt.value}/` + this.cronState.months;
        }
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
      case 6:
        this.cronState.years = `R(${this.formControl.years.between.start.value}-${this.formControl.years.between.end.value})`;
        if (this.formControl.years.everyX.staringAt.value > 0) {
          this.cronState.years = `${this.formControl.years.everyX.staringAt.value}/` + this.cronState.years;
        }
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
      this.cronState.years = cronParts.length === 6 ? null : cronParts[6].trim();

      // parse seconds
      let {seconds} = this.cronState;
      if (seconds === '*') {
        this.formControl.seconds.type.setValue(1);
      } else if (seconds === 'R') {
        this.formControl.seconds.type.setValue(this.allowRandom ? 5 : 1);
      } else {
        if (seconds.indexOf('/') > -1 || seconds.indexOf('-') > -1) {
          if (seconds.indexOf('/') > -1) {
            const splitString = seconds.split('/');
            if (seconds.indexOf('-') === -1) {
              const split = mapNumbers(splitString);
              this.formControl.seconds.everyX.everyX.setValue(split[1]);
              this.formControl.seconds.everyX.staringAt.setValue(split[0]);

              this.formControl.seconds.type.setValue(2);
            } else {
              this.formControl.seconds.everyX.staringAt.setValue(Number(splitString[0]));
              seconds = seconds.substring(seconds.indexOf('/') + 1);
            }
          }
          if (seconds.indexOf('-') > -1) {
            let randomApplied = false;

            if (seconds.startsWith('R(')) {
              randomApplied = this.allowRandom;
              seconds = seconds.substring(2, seconds.length - 1);
            }

            const split = mapNumbers(seconds.split('-'));
            this.formControl.seconds.between.start.setValue(split[0]);
            this.formControl.seconds.between.end.setValue(split[1]);

            this.formControl.seconds.type.setValue(randomApplied ? 6 : 4);
          }
        } else {
          this.formControl.seconds.type.setValue(3);
          this.formControl.seconds.specific.setValue(mapNumbers(seconds.split(',')));
        }
      }

      // parse minutes
      let {minutes} = this.cronState;
      if (minutes === '*') {
        this.formControl.minutes.type.setValue(1);
      } else if (minutes === 'R') {
        this.formControl.minutes.type.setValue(this.allowRandom ? 5 : 1);
      } else {
        if (minutes.indexOf('/') > -1 || minutes.indexOf('-') > -1) {
          if (minutes.indexOf('/') > -1) {
            const splitString = minutes.split('/');
            if (minutes.indexOf('-') === -1) {
              const split = mapNumbers(splitString);
              this.formControl.minutes.everyX.everyX.setValue(split[1]);
              this.formControl.minutes.everyX.staringAt.setValue(split[0]);

              this.formControl.minutes.type.setValue(2);
            } else {
              this.formControl.minutes.everyX.staringAt.setValue(Number(splitString[0]));
              minutes = minutes.substring(minutes.indexOf('/') + 1);
            }
          }
          if (minutes.indexOf('-') > -1) {
            let randomApplied = false;

            if (minutes.startsWith('R(')) {
              randomApplied = this.allowRandom;
              minutes = minutes.substring(2, minutes.length - 1);
            }

            const split = mapNumbers(minutes.split('-'));
            this.formControl.minutes.between.start.setValue(split[0]);
            this.formControl.minutes.between.end.setValue(split[1]);

            this.formControl.minutes.type.setValue(randomApplied ? 6 : 4);
          }
        } else {
          this.formControl.minutes.type.setValue(3);
          this.formControl.minutes.specific.setValue(mapNumbers(minutes.split(',')));
        }
      }

      // parse hours
      let {hours} = this.cronState;
      if (hours === '*') {
        this.formControl.hours.type.setValue(1);
      } else {
        if (hours.indexOf('/') > -1 || hours.indexOf('-') > -1) {
          if (hours.indexOf('/') > -1) {
            const splitString = hours.split('/');
            if (hours.indexOf('-') === -1) {
              const split = mapNumbers(splitString);
              this.formControl.hours.everyX.everyX.setValue(split[1]);
              this.formControl.hours.everyX.staringAt.setValue(split[0]);

              this.formControl.hours.type.setValue(2);
            } else {
              this.formControl.hours.everyX.staringAt.setValue(Number(splitString[0]));
              hours = hours.substring(hours.indexOf('/') + 1);
            }
          }
          if (hours.indexOf('-') > -1) {
            let randomApplied = false;

            if (hours.startsWith('R(')) {
              randomApplied = this.allowRandom;
              hours = hours.substring(2, hours.length - 1);
            }

            const split = mapNumbers(hours.split('-'));
            this.formControl.hours.between.start.setValue(split[0]);
            this.formControl.hours.between.end.setValue(split[1]);

            this.formControl.hours.type.setValue(randomApplied ? 6 : 4);
          }
        } else {
          this.formControl.hours.type.setValue(3);
          this.formControl.hours.specific.setValue(mapNumbers(hours.split(',')));
        }
      }

      // parse days
      let {dayOfMonth, dayOfWeek} = this.cronState;
      if (dayOfWeek === '*' && dayOfMonth === '?') {
        this.formControl.days.type.setValue(1);
      } else if (dayOfWeek === 'MON-FRI' && dayOfMonth === '?') {
        this.formControl.days.type.setValue(2);
      } else if (dayOfWeek.indexOf('/') > -1 || dayOfWeek.indexOf('-') > -1) {
        if (dayOfWeek.indexOf('/') > -1) {
          const splitString = dayOfWeek.split('/');
          if (dayOfWeek.indexOf('-') === -1) {
            const split = mapNumbers(splitString);
            this.formControl.days.everyX.everyX.setValue(split[1]);
            this.formControl.days.everyX.staringAt.setValue(split[0]);

            this.formControl.days.type.setValue(3);
          } else {
            this.formControl.days.everyX.staringAt.setValue(Number(splitString[0]));
            dayOfWeek = dayOfWeek.substring(dayOfWeek.indexOf('/') + 1);
          }
        } else {
          this.formControl.days.everyX.staringAt.setValue(0);
        }
        if (dayOfWeek.indexOf('-') > -1) {
          let randomApplied = false;

          if (dayOfWeek.startsWith('R(')) {
            randomApplied = this.allowRandom;
            dayOfWeek = dayOfWeek.substring(2, dayOfWeek.length - 1);
          }

          const split = mapNumbers(dayOfWeek.split('-'));
          this.formControl.days.between.start.setValue(split[0]);
          this.formControl.days.between.end.setValue(split[1]);

          this.formControl.days.type.setValue(randomApplied ? 17 : 16);
        }
      } else if (dayOfMonth.indexOf('/') > -1 || dayOfMonth.indexOf('-') > -1) {
        if (dayOfMonth.indexOf('/') > -1) {
          const splitString = dayOfMonth.split('/');
          if (dayOfMonth.indexOf('-') === -1) {
            const split = mapNumbers(splitString);
            this.formControl.days.everyX.everyX.setValue(split[1]);
            this.formControl.days.everyX.staringAt.setValue(split[0]);

            this.formControl.days.type.setValue(2);
          } else {
            this.formControl.days.everyX.staringAt.setValue(Number(splitString[0]));
            dayOfMonth = dayOfMonth.substring(dayOfMonth.indexOf('/') + 1);
          }
        }
        if (dayOfMonth.indexOf('-') > -1) {
          let randomApplied = false;

          if (dayOfMonth.startsWith('R(')) {
            randomApplied = this.allowRandom;
            dayOfMonth = dayOfMonth.substring(2, dayOfMonth.length - 1);
          }

          const split = mapNumbers(dayOfMonth.split('-'));
          this.formControl.days.between.start.setValue(split[0]);
          this.formControl.days.between.end.setValue(split[1]);

          this.formControl.days.type.setValue(randomApplied ? 6 : 15);
        }
      } else if (dayOfMonth === 'L') {
        this.formControl.days.type.setValue(6);
      } else if (dayOfMonth === 'LW') {
        this.formControl.days.type.setValue(7);
      } else if (dayOfWeek.endsWith('L')) {
        const dayNumber = mapNumbers([dayOfWeek.charAt(0)])[0];

        this.formControl.days.lastDayOfWeekOfTheMonth.setValue(dayNumber);
        this.formControl.days.type.setValue(8);
      } else if (dayOfMonth.startsWith('L-')) {
        const dayOffset = mapNumbers([dayOfMonth.substr(2)]);

        this.formControl.days.XBeforeEnd.setValue(dayOffset);
        this.formControl.days.type.setValue(9);
      } else if (dayOfMonth.endsWith('W')) {
        const day = mapNumbers([dayOfMonth.substr(0, dayOfMonth.length - 1)]);

        this.formControl.days.nearestWeekdayTo.setValue(day);
        this.formControl.days.type.setValue(10);
      } else if (dayOfWeek.indexOf('#') > -1) {
        const split = mapNumbers(dayOfWeek.split('#'));

        this.formControl.days.XthDay.day.setValue(split[0]);
        this.formControl.days.XthDay.x.setValue(split[1]);

        this.formControl.days.type.setValue(11);
      } else {
        if (dayOfWeek !== '?') {
          const mapIDtoShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

          const values = [];

          for (let day of dayOfWeek.split(',')) {
            day = day.trim();
            if (!day.length) {
              continue;
            }
            let dayIndex = Number(day);
            if (isNaN(dayIndex)) {
              dayIndex = mapIDtoShort.indexOf(day);
            }
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

          this.formControl.days.type.setValue(14);
          this.formControl.days.specificDayOfWeek.setValue(values);
        } else {
          this.formControl.days.specificDayOfMonth.setValue(mapNumbers(dayOfMonth.split(',')));

          this.formControl.days.type.setValue(12);
        }
      }

      // parse month
      let {months} = this.cronState;
      if (months === '*') {
        this.formControl.months.type.setValue(1);
      } else if (months.indexOf('/') > -1 || months.indexOf('-') > -1) {
        if (months.indexOf('/') > -1) {
          const splitString = months.split('/');
          if (months.indexOf('-') === -1) {
            const split = mapNumbers(splitString);
            this.formControl.months.everyX.everyX.setValue(split[1]);
            this.formControl.months.everyX.staringAt.setValue(split[0]);

            this.formControl.months.type.setValue(2);
          } else {
            this.formControl.months.everyX.staringAt.setValue(Number(splitString[0]));
            months = months.substring(months.indexOf('/') + 1);
          }
        }
        if (months.indexOf('-') > -1) {
          let randomApplied = false;

          if (months.startsWith('R(')) {
            randomApplied = this.allowRandom;
            months = months.substring(2, months.length - 1);
          }

          const split = mapNumbers(months.split('-'));
          this.formControl.months.between.start.setValue(split[0]);
          this.formControl.months.between.end.setValue(split[1]);

          this.formControl.months.type.setValue(randomApplied ? 6 : 4);
        }
      } else {
        const mapIDtoShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const values = [];

        for (let month of months.split(',')) {
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
      let {years} = this.cronState;
      if (!years || years === '*') {
        this.formControl.years.type.setValue(1);
      } else if (years === 'R') {
        this.formControl.years.type.setValue(this.allowRandom ? 5 : 1);
      } else {
        if (years.indexOf('/') > -1 || years.indexOf('-') > -1) {
          if (years.indexOf('/') > -1) {
            const splitString = years.split('/');
            if (years.indexOf('-') === -1) {
              const split = mapNumbers(splitString);
              this.formControl.years.everyX.everyX.setValue(split[1]);
              this.formControl.years.everyX.staringAt.setValue(split[0]);

              this.formControl.years.type.setValue(2);
            } else {
              this.formControl.years.everyX.staringAt.setValue(Number(splitString[0]));
              years = years.substring(years.indexOf('/') + 1);
            }
          }
          if (years.indexOf('-') > -1) {
            let randomApplied = false;

            if (years.startsWith('R(')) {
              randomApplied = this.allowRandom;
              years = years.substring(2, years.length - 1);
            }

            const split = mapNumbers(years.split('-'));
            this.formControl.years.between.start.setValue(split[0]);
            this.formControl.years.between.end.setValue(split[1]);

            this.formControl.years.type.setValue(randomApplied ? 6 : 4);
          }
        } else {
          this.formControl.years.type.setValue(3);
          this.formControl.years.specific.setValue(mapNumbers(years.split(',')));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (this.validatorOnChangeFn) {
        this.validatorOnChangeFn();
      }
    }
    this._ignore_reading = false;
  }

  private setRandomAbleValues() {
    this.randomAbleSelectTypeValues = this._allowRandom ?
      [...this._defaultSelectTypeValues, {ID: 5, Value: 'Random'}, {ID: 6, Value: 'Random between'}]
      : this._defaultSelectTypeValues;
    this.defaultSelectTypeValues = this._allowRandom ?
      [...this._defaultSelectTypeValues, {ID: 6, Value: 'Random between'}]
      : this._defaultSelectTypeValues;
    this.daySelectTypeValues = this._allowRandom ?
      [...this._daySelectTypeValues, {ID: 6, Value: 'Random day of month between'}, {ID: 17, Value: 'Random day of week between'}]
      : this._daySelectTypeValues;

    this.cronValidator = cronExpressionValidator(this._allowRandom, this.fixedState);
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
    return this.cronValidator(control);
  }

}
