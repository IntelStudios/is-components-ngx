export interface IISTreeNode {
  ID?: number | string;
  Icon?: string;
  Name: string;
  PropagateValue?: boolean;
  /**
   * disable children when this node is checked (any value)
   */
  DisableChildren?: boolean;
  Values?: { [fieldName: string]: boolean; };
  Children?: IISTreeNode[];
}
