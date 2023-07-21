import { iconBetween, iconEmpty, iconEq, iconGeq, iconGt, iconLeq, iconLt, iconNeq, iconNotBetween, iconNotEmpty } from './filter-type.internal';
import { FilterType, IFilterDef } from './filter.type';

export const DATE_DEFS: { [key in FilterType]?: IFilterDef } = {
  DateTimeEq: {
    Type: 'DateTimeEq',
    Name: 'equals',
    Icon: iconEq,
    InputType: 'date',
  },
  DateTimeNotEq: {
    Type: 'DateTimeNotEq',
    Name: 'not equals',
    Icon: iconNeq,
    InputType: 'date',
  },
  DateTimeGt: {
    Type: 'DateTimeGt',
    Name: 'greater than',
    Icon: iconGt,
    InputType: 'date',
  },
  DateTimeLt: {
    Type: 'DateTimeLt',
    Name: 'less than',
    Icon: iconLt,
    InputType: 'date',
  },
  DateTimeGeq: {
    Type: 'DateTimeGeq',
    Name: 'greater of equals',
    Icon: iconGeq,
    InputType: 'date',
  },
  DateTimeLeq: {
    Type: 'DateTimeLeq',
    Name: 'less of equals',
    Icon: iconLeq,
    InputType: 'date',
  },
  DateTimeBetween: {
    Type: 'DateTimeBetween',
    Name: 'between',
    Icon: iconBetween,
    InputType: 'date-range',
  },
  DateTimeNotBetween: {
    Type: 'DateTimeNotBetween',
    Name: 'not between',
    Icon: iconNotBetween,
    InputType: 'date-range',
  },
  DateTimeEmpty: {
    Type: 'DateTimeEmpty',
    Name: 'empty',
    Icon: iconEmpty,
    InputType: 'none',
  },
  DateTimeNotEmpty: {
    Type: 'DateTimeNotEmpty',
    Name: 'not empty',
    Icon: iconNotEmpty,
    InputType: 'none',
  }
};