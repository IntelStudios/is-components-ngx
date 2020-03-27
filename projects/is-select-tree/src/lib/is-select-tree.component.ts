import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TreeComponent, TreeNode } from 'angular-tree-component';
import { Subscription } from 'rxjs';

import { IsSelectTree, IsSelectTreeChangeEvent, IsSelectTreeNode } from './is-select-tree.models';

@Component({
  selector: 'is-select-tree',
  templateUrl: './is-select-tree.component.html',
  styleUrls: ['./is-select-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsSelectTreeComponent implements OnDestroy {

  @Input()
  instantSave: boolean = true;

  @Input()
  set selection(tree: IsSelectTree) {
    this._selection = tree;
    if (this._selection) {
      this._treeChangeSub && this._treeChangeSub.unsubscribe();
      this._treeChangeSub = this.selection.changed.subscribe((e: IsSelectTreeChangeEvent) => {
        if (!this.instantSave) {
          e.saveFinished();
        }
        this.change.emit(e);
      });
    }
  }

  get selection(): IsSelectTree {
    return this._selection;
  }

  private _selection: IsSelectTree;

  @Output()
  onNodeActivateChanged: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onInitialized: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  change: EventEmitter<IsSelectTreeChangeEvent> = new EventEmitter<IsSelectTreeChangeEvent>();

  options: any = {
    useVirtualScroll: false,
    nodeHeight: 13
  };

  @ViewChild('tree')
  tree: TreeComponent;

  isExpanded: boolean = true;
  private _treeChangeSub: Subscription;

  constructor(private changeDetector: ChangeDetectorRef) {

  }

  ngOnDestroy() {
    if (this._treeChangeSub) {
      this._treeChangeSub.unsubscribe();
    }
  }

  toggleExpand(depth?: number) {
    depth = depth || 0;
    if (this.isExpanded) {
      this.collapseTree(depth);
    } else {
      this.expandTree(depth);
    }
  }

  expandTree(depth?: number) {
    this.changeDetector.detach();
    this.isExpanded = true;
    depth = depth || 0;
    this.tree.treeModel.roots.forEach((root: TreeNode) => {
      root.expandAll();
    });
    this.changeDetector.reattach();
  }

  collapseTree(depth?: number) {
    this.isExpanded = false;
    depth = depth || 0;
    this.tree.treeModel.roots.forEach((root: TreeNode) => {
      root.collapseAll();
    });
  }

  onActiveChanged(event: any) {
    this.onNodeActivateChanged.emit(event);
  }

  onTreeInitialized() {
    this.onInitialized.emit();
  }

  /**
   * sets initial tree expand depth. Parameter `upToLevel` is the depth in the tree
   * to initially expand nodes. -1 means unlimited depth, 0 means not expanded, 1 means roots expanded etc.
   * {number} upToLevel [description]
   */
  setInitialExpandLevel(upToLevel: number) {
    this.isExpanded = upToLevel > 0 || upToLevel == -1;
    if (this.isExpanded) {

      this.selection.eachNode((node: IsSelectTreeNode, level: number) => {
        if (upToLevel >= level || upToLevel == -1) {
          node.isExpanded = this.isExpanded;
        }
      });

      setTimeout(() => {
        //this.tree.treeModel['_calculateExpandedNodes']();
        this.changeDetector.markForCheck();
      });
    } else {
      this.changeDetector.markForCheck();
    }
  }

  filterLeaves(value: string) {
    if (!value) {
      this.tree.treeModel.filterNodes(() => true);
      this.changeDetector.markForCheck();
      return;
    }
    value = value.toLowerCase();
    this.tree.treeModel.filterNodes((node: TreeNode) => {
      return node.isLeaf && (<IsSelectTreeNode>node.data).name.toLowerCase().indexOf(value) > -1;
    });
    this.expandTree();
  }

  filterNodes(value: string) {
    if (!value) {
      this.tree.treeModel.filterNodes((node: TreeNode) => {
        const n: IsSelectTreeNode = node.data as IsSelectTreeNode;
        n.$matchesFilter = false;
        return true;
      });
      this.changeDetector.markForCheck();
      return;
    }
    value = value.toLowerCase();
    this.tree.treeModel.filterNodes((node: TreeNode) => {
      const n: IsSelectTreeNode = node.data as IsSelectTreeNode;
      if (n.parent && n.parent.$matchesFilter) {
        n.$matchesFilter = n.parent.$matchesFilter;
      } else {
        n.$matchesFilter = n.name.toLowerCase().indexOf(value) > -1;
      }
      return n.$matchesFilter;
    });
    this.expandTree();
  }

  private collapseNode(node: TreeNode, maxDepth: number, depth?: number) {
    if (!depth) {
      depth = 1;
    }
    node.collapse();
    if (maxDepth > 0 && depth >= maxDepth) {
      return;
    }
    node.children.forEach((child: TreeNode) => this.collapseNode(child, maxDepth, depth));
  }

  private expandNode(node: TreeNode, maxDepth: number, depth?: number) {
    if (!depth) {
      depth = 1;
    }
    node.expand();
    if (maxDepth > 0 && depth >= maxDepth) {
      return;
    }
    node.children.forEach((child: TreeNode) => this.expandNode(child, maxDepth, depth));
  }

}
