import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TreeModule } from 'angular-tree-component';

import { IsDXSelectTreeNodeComponent } from './is-dx-select-tree-node.component';
import { IsDXSelectTreeComponent } from './is-dx-select-tree.component';

@NgModule({
  imports: [
    CommonModule, TreeModule, TranslateModule
  ],
  declarations: [IsDXSelectTreeComponent, IsDXSelectTreeNodeComponent],
  exports: [IsDXSelectTreeComponent]
})
export class IsDXSelectTreeModule { }
