import { FilterType } from './models';


export interface IsInputMappingInput {
  InputSchema: InputSchema[];
  DataStructure: DataStructure;
}

export interface IsInputMappingValue {
  // Mapping is always internally converted to the Map
  InputSchemaMapping: Map<string, string> | { [id: string]: string };
  InputSchemaFilter?: { [id: string]: IsInputSchemaFilter[] };
}

export interface IsInputSchemaFilter {
  Type: FilterType;
  Value: string;
  Value2?: string;
}

export interface IsInputSchemaFilterStatus {
  Path?: string;
  Filters: IsInputSchemaFilter[];
  EmmitChange: boolean;
}

export interface InputSchema {
  Name: string;
  DataType: number;
  AllowNull: boolean;
  IsComplex: boolean;
}

export interface DataStructure {
  Children: DataStructure[];
  Path: string;
  Name: string;
  Description?: string;
  Type: number;
  DataType: number;
  InputColumns: string[];
}

export interface AssignStatus {
  Item: InputSchema;
  PaintedPath: number[];
  Path: string;
  EmmitChange?: boolean;
}

export interface FilterValueFormatter {
  formatDate(value: string): string;
}