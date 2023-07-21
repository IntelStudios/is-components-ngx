import { iconContains, iconEmpty, iconEq, iconIn, iconNeq, iconNotContains, iconNotEmpty, iconNotIn } from './filter-type.internal';
import { FilterType, IFilterDef } from './filter.type';

export const STRING_DEFS: { [key in FilterType]?: IFilterDef } = {
  StringEq: {
    Type: 'StringEq',
    Name: 'equals',
    Icon: iconEq,
    InputType: 'text',
  },
  StringNotEq: {
    Type: 'StringNotEq',
    Name: 'not equals',
    Icon: iconNeq,
    InputType: 'text',
  },
  StringIn: {
    Type: 'StringIn',
    Name: 'in',
    Icon: iconIn,
    InputType: 'text',
  },
  StringNotIn: {
    Type: 'StringNotIn',
    Name: 'not in',
    Icon: iconNotIn,
    InputType: 'text',
  },
  StringContains: {
    Type: 'StringContains',
    Name: 'contains',
    Icon: iconContains,
    InputType: 'text',
  },
  StringNotContains: {
    Type: 'StringNotContains',
    Name: 'not contains',
    Icon: iconNotContains,
    InputType: 'text',
  },
  StringEmpty: {
    Type: 'StringEmpty',
    Name: 'empty',
    Icon: iconEmpty,
    InputType: 'none',
  },
  StringNotEmpty: {
    Type: 'StringNotEmpty',
    Name: 'not empty',
    Icon: iconNotEmpty,
    InputType: 'none',
  },
};