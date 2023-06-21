type FilterTypeString = 'StringEq' | 'StringNotEq' | 'StringContains' | 'StringNotContains' | 'StringIn' | 'StringNotIn' | 'StringEmpty' | 'StringNotEmpty';
type FilterTypeDateTime = 'DateTimeEq' | 'DateTimeNotEq' | 'DateTimeGt' | 'DateTimeLt' | 'DateTimeGeq' | 'DateTimeLeq' | 'DateTimeBetween' | 'DateTimeNotBetween' | 'DateTimeEmpty' | 'DateTimeNotEmpty';
type FilterTypeBoolean = 'BoolTrue' | 'BoolFalse' | 'BoolEmpty' | 'BoolNotEmpty';
type FilterTypeInt = 'IntEq' | 'IntNotEq' | 'IntGt' | 'IntLt' | 'IntGeq' | 'IntLeq' | 'IntBetween' | 'IntNotBetween' | 'IntIn' | 'IntNotIn' | 'IntEmpty' | 'IntNotEmpty';
type FilterTypeDouble = 'DoubleEq' | 'DoubleNotEq' | 'DoubleGt' | 'DoubleLt' | 'DoubleGeq' | 'DoubleLeq' | 'DoubleBetween' | 'DoubleNotBetween' | 'DoubleIn' | 'DoubleNotIn' | 'DoubleEmpty' | 'DoubleNotEmpty';
type FilterTypeJson = 'JsonEmpty' | 'JsonNotEmpty';
type FilterTypeBase64 = 'Base64Empty' | 'Base64NotEmpty';

export type FilterType = FilterTypeString | FilterTypeDateTime | FilterTypeBoolean | FilterTypeInt | FilterTypeDouble | FilterTypeJson | FilterTypeBase64;


export type FilterInputType = 'none' | 'text' | 'date' | 'date-range' | 'number' | 'number-range';

export interface IFilterDef {
  Type: FilterType;
  Name: string;
  Icon: string;
  InputType: FilterInputType
}