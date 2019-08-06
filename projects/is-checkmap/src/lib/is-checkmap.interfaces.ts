
export interface IsCheckmapTreeNode {
  ID: number,
  EntityName: string,
  Children?: IsCheckmapTreeNode[];
  IsVirtual?: boolean;
}

export interface IsCheckmapCell {
  leftID: number;
  leftParentID: number;
  topID: number;

}

export interface IsCheckmapModel {
  LeftTree: IsCheckmapTreeNode;

}
