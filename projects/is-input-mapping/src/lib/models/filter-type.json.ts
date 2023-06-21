import { iconEmpty, iconNotEmpty } from './filter-type.internal';
import { FilterType, IFilterDef } from './filter.type';

export const JSON_DEFS: { [key in FilterType]?: IFilterDef } = {
  StringEmpty: {
    Type: 'JsonEmpty',
    Name: 'empty',
    Icon: iconEmpty,
    InputType: 'none',
  },
  StringNotEmpty: {
    Type: 'JsonNotEmpty',
    Name: 'not empty',
    Icon: iconNotEmpty,
    InputType: 'none',
  },
};