import { iconEmpty, iconNotEmpty } from './filter-type.internal';
import { FilterType, IFilterDef } from './filter.type';

export const BOOL_DEFS: { [key in FilterType]?: IFilterDef } = {
  BoolTrue: {
    Type: 'BoolTrue',
    Name: 'is true',
    Icon: 'fa fa-check',
    InputType: 'none',
  },
  BoolFalse: {
    Type: 'BoolFalse',
    Name: 'is false',
    Icon: 'fa fa-exclamation',
    InputType: 'none',
  },
  BoolEmpty: {
    Type: 'BoolEmpty',
    Name: 'empty',
    Icon: iconEmpty,
    InputType: 'none',
  },
  BoolNotEmpty: {
    Type: 'BoolNotEmpty',
    Name: 'not empty',
    Icon: iconNotEmpty,
    InputType: 'none',
  },
};