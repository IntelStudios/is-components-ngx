import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IsDXSelectField, IsDXSelectTree, IsDXSelectTreeChangeEvent, IsDXSelectTreeModule, IsDXSelectTreeNode } from 'projects/is-dx-select-tree/src/public_api';

@Component({
  selector: 'app-demo-dx-select-tree',
  templateUrl: './demo-dx-select-tree.component.html',
  styleUrls: ['./demo-dx-select-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoDXSelectTreeComponent {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-dx-select-tree-7.0.1.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsDXSelectTreeModule } from 'is-dx-select-tree';</pre>

<p>
  DX Select tree is a special kind of tree, when we can select only nodes, which has canSelect property = true & only one node can be selected.<br>
  Another feature is that also parent can be selected only, without the leaves (children).
</p>
`

  tree1: IsDXSelectTree = IsDXSelectTree.deserializeTree(
    {
      Name: 'Virtual Root',
      CanSelect: false,
      ID: 1,
      Path: '*',
      Children: [
        { ID: 2, Name: 'Node 1', CanSelect: false, Path: '*' },
        { ID: 3, Name: 'Node 2', Values: { IsSelected: false }, CanSelect: true, Path: '*', Children: [
          { ID: 4, Name: 'Node 1', CanSelect: false, Path: '*'},
          { ID: 5, Name: 'Node 2', Path: '*', Values: { IsSelected: false }, CanSelect: false },
          { ID: 6, Name: 'Node 3', Path: '*', Values: { IsSelected: false }, CanSelect: true, $checked: true },
          { ID: 7, Name: 'Node 4', Path: '*', Values: { IsSelected: true }, CanSelect: false }
        ]},
        { ID: 8, Name: 'Node 3', Path: '*', Values: { IsSelected: true }, CanSelect: false },
        { ID: 9, Name: 'Node 4', Path: '*', Values: { IsSelected: true }, CanSelect: true }
      ],
    },
    null,
    IsDXSelectField.selected()
  );

  constructor() { }

  onSelected(node: IsDXSelectTreeNode) {
    console.log('onSelected', node);
  }

}
