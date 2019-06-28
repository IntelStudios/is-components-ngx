import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Maps an array of strings into numbers, throwing an Error if some element was not a number
 * @param array array of strings to convert to numbers
 */
export function mapNumbers(array: any[]): number[] {
  const a2 = [];
  for (const i of array) {
    const n = Number(i);
    if (isNaN(n)) {
      throw Error(`'${n}' is not a number`);
    }
    a2.push(n);
  }
  return a2;
}

export function cronExpressionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !control.value.length) {
      return null;
    }

    try {
      const cronParts = control.value.split(' ');
      if (cronParts.length !== 7) {
        // noinspection ExceptionCaughtLocallyJS
        throw Error('invalid cron expression length');
      }

      const cronState = {
        seconds: cronParts[0].trim(),
        minutes: cronParts[1].trim(),
        hours: cronParts[2].trim(),
        dayOfMonth: cronParts[3].trim().toUpperCase(),
        months: cronParts[4].trim().toUpperCase(),
        dayOfWeek: cronParts[5].trim().toUpperCase(),
        years: cronParts[6].trim()
      };

      for (const k of Object.keys(cronState)) {
        if (!cronState[k].length) {
          // noinspection ExceptionCaughtLocallyJS
          throw Error('missing ' + k);
        }
      }

      // validate seconds
      if (cronState.seconds === '*') {
      } else if (cronState.seconds.indexOf('/') > -1) {
        mapNumbers(cronState.seconds.split('/'));
      } else if (cronState.seconds.indexOf('-') > -1) {

        mapNumbers(cronState.seconds.split('-'));
      } else {
        mapNumbers(cronState.seconds.split(','));
      }

      // validate minutes
      if (cronState.minutes === '*') {
      } else if (cronState.minutes.indexOf('/') > -1) {
        mapNumbers(cronState.minutes.split('/'));
      } else if (cronState.minutes.indexOf('-') > -1) {

        mapNumbers(cronState.minutes.split('-'));
      } else {
        mapNumbers(cronState.minutes.split(','));
      }

      // validate hours
      if (cronState.hours === '*') {
      } else if (cronState.hours.indexOf('/') > -1) {
        mapNumbers(cronState.hours.split('/'));
      } else if (cronState.hours.indexOf('-') > -1) {

        mapNumbers(cronState.hours.split('-'));
      } else {
        mapNumbers(cronState.hours.split(','));
      }

      // validate days
      if (cronState.dayOfWeek === '*' && cronState.dayOfMonth === '?') {
      } else if (cronState.dayOfWeek === 'MON-FRI' && cronState.dayOfMonth === '?') {
      } else if (cronState.dayOfWeek.indexOf('/') > -1) {
        mapNumbers(cronState.dayOfWeek.split('/'));
      } else if (cronState.dayOfMonth.indexOf('/') > -1) {
        mapNumbers(cronState.dayOfMonth.split('/'));
      } else if (cronState.dayOfMonth === 'L') {
      } else if (cronState.dayOfMonth === 'LW') {
      } else if (cronState.dayOfWeek.endsWith('L')) {
        mapNumbers([cronState.dayOfWeek.charAt(0)]);
      } else if (cronState.dayOfMonth.startsWith('L-')) {
        mapNumbers([cronState.dayOfMonth.substr(2)]);
      } else if (cronState.dayOfMonth.endsWith('W')) {
        mapNumbers([cronState.dayOfMonth.substr(0, cronState.dayOfMonth.length - 1)]);
      } else if (cronState.dayOfWeek.indexOf('#') > -1) {
        mapNumbers(cronState.dayOfWeek.split('#'));
      } else {
        if (cronState.dayOfWeek.length > cronState.dayOfMonth.length) {
          const mapIDtoShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

          for (let day of cronState.dayOfWeek.split(',')) {
            day = day.trim();
            if (!day.length) {
              continue;
            }
            const dayIndex = mapIDtoShort.indexOf(day);
            if (dayIndex === -1) {
              // noinspection ExceptionCaughtLocallyJS
              throw Error('this day does not exist');
            }
          }
        }
      }

      // validate month
      if (cronState.months === '*') {
      } else if (cronState.months.indexOf('/') > -1) {
        mapNumbers(cronState.months.split('/'));
      } else if (cronState.months.indexOf('-') > -1) {

        mapNumbers(cronState.months.split('-'));
      } else {
        const mapIDtoShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        for (let month of cronState.months.split(',')) {
          month = month.trim();
          if (!month.length) {
            continue;
          }
          const monthIndex = mapIDtoShort.indexOf(month);
          if (monthIndex === -1) {
            // noinspection ExceptionCaughtLocallyJS
            throw Error('this month does not exist');
          }
        }
      }

      // validate years
      if (cronState.years === '*') {
      } else if (cronState.years.indexOf('/') > -1) {
        mapNumbers(cronState.years.split('/'));
      } else if (cronState.years.indexOf('-') > -1) {

        mapNumbers(cronState.years.split('-'));
      } else {
        mapNumbers(cronState.years.split(','));
      }
      return null;
    } catch (e) {
      return {'cron-expression-error': (<Error>e).message};
    }
  };
}
