import { iconEmpty, iconNotEmpty } from './filter-type.internal';
import { FilterType, IFilterDef } from './filter.type';

export const JSON_DEFS: { [key in FilterType]?: IFilterDef } = {
  JsonEmpty: {
    Type: 'JsonEmpty',
    Name: 'empty',
    Icon: iconEmpty,
    InputType: 'none',
  },
  JsonNotEmpty: {
    Type: 'JsonNotEmpty',
    Name: 'not empty',
    Icon: iconNotEmpty,
    InputType: 'none',
  },
};