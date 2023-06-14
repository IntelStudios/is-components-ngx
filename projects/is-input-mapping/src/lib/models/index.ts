import { BOOL_DEFS } from './filter-type.bool';
import { DATE_DEFS } from './filter-type.date';
import { DOUBLE_DEFS } from './filter-type.double';
import { INT_DEFS } from './filter-type.int';
import { STRING_DEFS } from './filter-type.string';
import { FilterType, IFilterDef } from './filter.type';

export * from './filter.type';

export const FILTER_DEFS: { [key in FilterType]?: IFilterDef } = {
  ...STRING_DEFS,
  ...DATE_DEFS,
  ...INT_DEFS,
  ...DOUBLE_DEFS,
  ...BOOL_DEFS,
};


/**
 * limited set of supported filter types
 */
export const FILTER_TYPES_LIMITED: { [key: string]: IFilterDef[] } = {
  // Integer
  1:[],
  // String
  2: [STRING_DEFS.StringEq, STRING_DEFS.StringNotEq],
  // boolean
  3: [],
  // Base64
  4: [],
  // DateTime
  5: [],
  // Double
  6: [],
  // table
  7: [],
  // JSON
  8: [],
};


export const FILTER_TYPES: { [key: string]: IFilterDef[] } = {
  // Integer
  1: Object.values(INT_DEFS),
  // String
  2: Object.values(STRING_DEFS),
  // boolean
  3: Object.values(BOOL_DEFS),
  // Base64
  4: [],
  // DateTime
  5: Object.values(DATE_DEFS),
  // Double
  6: Object.values(DOUBLE_DEFS),
  // table
  7: [],
  // JSON
  8: [],
};