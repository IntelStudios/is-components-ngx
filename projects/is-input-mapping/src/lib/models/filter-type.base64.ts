import { iconEmpty, iconNotEmpty } from './filter-type.internal';
import { FilterType, IFilterDef } from './filter.type';

export const BASE64_DEFS: { [key in FilterType]?: IFilterDef } = {
  StringEmpty: {
    Type: 'Base64Empty',
    Name: 'empty',
    Icon: iconEmpty,
    InputType: 'none',
  },
  StringNotEmpty: {
    Type: 'Base64NotEmpty',
    Name: 'not empty',
    Icon: iconNotEmpty,
    InputType: 'none',
  },
};