import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TreeNode } from 'angular-tree-component';
import { Subscription } from 'rxjs';

import { IsDXSelectTree, IsDXSelectTreeNode } from './is-dx-select-tree.models';

@Component({
  selector: 'is-dx-select-tree-node',
  templateUrl: './is-dx-select-tree-node.component.html',
  styleUrls: ['is-dx-select-tree-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsDXSelectTreeNodeComponent implements OnInit, OnDestroy {

  @Input()
  node: TreeNode;

  @Input()
  selection: IsDXSelectTree;

  @Output()
  selected: EventEmitter<IsDXSelectTreeNode>;

  private _sub: Subscription;

  constructor(private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef) {
    this.selected = new EventEmitter<IsDXSelectTreeNode>();
  }

  ngOnInit() {
    const node: IsDXSelectTreeNode = this.node.data;
    this._sub = node.onUpdateView.subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  toggleExpandNode() {
    this.node.toggleExpanded();
    this.node.toggleActivated();
    this.changeDetector.detectChanges();
  }

  sanitize(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // private findFirstVisibleNonVirutalChild(node: TreeNode): IsDXSelectTreeNode {
  //   let found: IsDXSelectTreeNode = null;
  //   node.visibleChildren.forEach((n: TreeNode) => {
  //     if (!found) {
  //       if (!n.data.isVirtual()) {
  //         found = n.data;
  //       } else {
  //         found = this.findFirstVisibleNonVirutalChild(n);
  //       }
  //     }
  //   });
  //   return found;
  // }

  onSelect() {
    //this.node.data.$checked = !this.node.data.$checked;
    //this.node.data.$checked ?  : this.selected.emit(null);

    this.selection.eachNode((node: IsDXSelectTreeNode) => {
      if (node.id === this.node.id) {
        node.$checked = !this.node.data.$checked;
        this.selected.emit(this.node.data);
      } else {
        node.$checked = false;
      }
    })

    this.changeDetector.markForCheck();
  }

  // toggleSelect(event: any, treeNode: TreeNode, field: IsDXSelectField) {
  //   event.stopPropagation();
  //   const node: IsDXSelectTreeNode = treeNode.data;
  //   let value: boolean = !node.getValue(field);
  //   if (node.isVirtual()) {
  //     // virtual nodes are initially unset, we need to determine based on first child
  //     const first = this.findFirstVisibleNonVirutalChild(treeNode);
  //     value = first ? !first.getValue(field) : false;
  //   }
  //   if (this.selection.indicateSaving) {
  //     node.$isSaving = true;
  //   }

  //   const change: IsDXSelectTreeChangeEvent = new IsDXSelectTreeChangeEvent(() => {
  //     if (this.selection.indicateSaving) {
  //       node.$isSaving = false;
  //     }
  //     this.selection.updateView();
  //   });

  //   this.setValue(treeNode, field, value, node.isPropagateValue, change);
  //   if (value === true) {
  //     // set dependent field to true as well
  //     if (field.dependentFieldName) {
  //       const dep: IsDXSelectField = this.selection.selectionFields.find((f: IsDXSelectField) => f.fieldName === field.dependentFieldName);
  //       if (!dep) {
  //         console.warn('unable to find dependent field for', field);
  //       } else {
  //         this.setValue(treeNode, dep, value, node.isPropagateValue, change);
  //       }
  //     }
  //   }
  //   if (value === false) {
  //     // find field which we depend on and set it's value to false
  //     const dep: IsDXSelectField = this.selection.selectionFields.find((f: IsDXSelectField) => f.dependentFieldName === field.fieldName);
  //     if (dep) {
  //       this.setValue(treeNode, dep, value, node.isPropagateValue, change);
  //     }
  //   }

  //   this.selection.changed.emit(change);
  // }


  ngOnDestroy() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  // private setValue(treeNode: TreeNode, field: IsDXSelectField, value: any, deep: boolean, change: IsDXSelectTreeChangeEvent) {
  //   const node: IsDXSelectTreeNode = treeNode.data;
  //   node.setValue(field, value);
  //   if (!node.isVirtual()) {
  //     const c = change.changes[node.id] || {};
  //     this.selection.selectionFields.forEach((f: IsDXSelectField) => {
  //       c[f.fieldName] = node.getValue(f);
  //     });
  //     change.changes[node.id] = c;
  //   }
  //   this.selection.updateParentClasses(node, field);
  //   if (deep) {
  //     treeNode.children.forEach((n: TreeNode) => {
  //       if (!n.isHidden) {
  //         this.setValue(n, field, value, true, change);
  //       }
  //     });
  //   }
  // }

}
