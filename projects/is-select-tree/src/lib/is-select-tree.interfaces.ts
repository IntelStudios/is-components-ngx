export interface IISTreeNode {
  ID?: number | string;
  Icon?: string;
  Name: string;
  PropagateValue?: boolean;
  Values?: { [fieldName: string]: boolean; };
  Children?: IISTreeNode[];
}
