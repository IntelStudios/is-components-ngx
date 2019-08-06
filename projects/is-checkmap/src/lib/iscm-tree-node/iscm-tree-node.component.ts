import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { IsCheckmapTreeNode } from '../is-checkmap.interfaces';

@Component({
  selector: 'iscm-tree-node',
  templateUrl: './iscm-tree-node.component.html',
  styleUrls: ['./iscm-tree-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IscmTreeNodeComponent implements OnInit {

  @Input()
  node: IsCheckmapTreeNode;

  constructor() { }

  ngOnInit() {
  }

}
