import { NgModule } from '@angular/core';
import { IsCheckmapComponent } from './is-checkmap.component';
import { IscmTreeComponent } from './iscm-tree/iscm-tree.component';
import { IscmTreeNodeComponent } from './iscm-tree-node/iscm-tree-node.component';
import { IscmCellComponent } from './iscm-cell/iscm-cell.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [IsCheckmapComponent, IscmTreeComponent, IscmTreeNodeComponent, IscmCellComponent],
  imports: [
    CommonModule
  ],
  exports: [IsCheckmapComponent]
})
export class IsCheckmapModule { }
