import { Pipe, PipeTransform } from '@angular/core';
import { FilterValueFormatter, IsInputSchemaFilter } from '../is-input-mapping.interface';
import { IFilterDef } from '../models';


@Pipe({
  name: 'isInputMappingFilterValue'
})
export class IsInputMappingFilterValue implements PipeTransform {

  constructor() {

  }

  transform(value: IsInputSchemaFilter, filterDef: IFilterDef, formatter?: FilterValueFormatter): string {
    const { Value, Value2 } = value;
    if (filterDef.InputType === 'date') {
      return this.formatDate(Value, formatter);
    }
    if (filterDef.InputType === 'date-range') {
      return `${this.formatDate(Value, formatter)} - ${this.formatDate(Value2, formatter)}`;
    }
    if (filterDef.InputType === 'number-range') {
      return `${Value} - ${Value2}`;
    }
    return Value;
  }

  private formatDate(date: string, formatter?: FilterValueFormatter) {
    return formatter?.formatDate(date) ?? new Date(date).toLocaleDateString();
  }
}