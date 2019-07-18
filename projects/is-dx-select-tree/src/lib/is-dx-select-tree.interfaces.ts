export interface IISTreeNode {
  ID?: number;
  Icon?: string;
  Name: string;
  Values?: { [fieldName: string]: boolean; };
  Children?: IISTreeNode[];
  CanSelect?: boolean;  // if parent or children can be selected
  Path: string;         // unique value
  $checked?: boolean;
}
