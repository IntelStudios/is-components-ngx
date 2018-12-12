import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsSelectTreeComponent } from './is-select-tree.component';
import { IsSelectTreeNodeComponent } from './is-select-tree-node.component';
import { TreeModule } from 'angular-tree-component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule, TreeModule, TranslateModule
  ],
  declarations: [IsSelectTreeComponent, IsSelectTreeNodeComponent],
  exports: [IsSelectTreeComponent]
})
export class IsSelectTreeModule { }
