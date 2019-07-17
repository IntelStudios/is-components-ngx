export interface IISTreeNode {
  ID?: number;
  Icon?: string;
  Name: string;
  Values?: { [fieldName: string]: boolean; };
  Children?: IISTreeNode[];
  CanSelect?: boolean;
}
