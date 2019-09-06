export interface IsInputMappingInput {
  InputSchema: InputSchema[];
  DataStructure: DataStructure;
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
  Type: number;
  DataType: number;
  InputColumns: string[];
}

export interface AssignStatus {
  Item: InputSchema;
  PaintedPath: number[];
  Path: string;
}
