import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IsDXSelectField, IsDXSelectTree, IsDXSelectTreeChangeEvent } from 'projects/is-dx-select-tree/src/public_api';

@Component({
  selector: 'app-demo-dx-select-tree',
  templateUrl: './demo-dx-select-tree.component.html',
  styleUrls: ['./demo-dx-select-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoDXSelectTreeComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-dx-select-tree-7.0.0.tgz</pre>

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
      Children: [
        { ID: 1, Name: 'Node 1', CanSelect: false },
        { ID: 2, Name: 'Node 2', Values: { IsSelected: false }, CanSelect: true, Children: [
          { ID: 1, Name: 'Node 1', CanSelect: false },
          { ID: 2, Name: 'Node 2', Values: { IsSelected: false }, CanSelect: false },
          { ID: 3, Name: 'Node 3', Values: { IsSelected: false }, CanSelect: true },
          { ID: 4, Name: 'Node 4', Values: { IsSelected: true }, CanSelect: false }
        ]},
        { ID: 3, Name: 'Node 3', Values: { IsSelected: true }, CanSelect: false },
        { ID: 4, Name: 'Node 4', Values: { IsSelected: true }, CanSelect: true }
      ],
    },
    null,
    IsDXSelectField.selected()
  );

  // tree2: IsDXSelectTree = IsDXSelectTree.deserializeTree(
  //   {
  //     Name: 'Virtual Root',
  //     Children: [
  //       { ID: 1, Name: 'Node 1', Icon:'fa fa-beer', Values: { IsVisible: true, IsEditable: true } },
  //       { ID: 2, Name: 'Node 2' },
  //       {
  //         Name: 'Node 3 (virtual)',
  //         Children: [
  //           { ID: 4, Name: 'Node 4', Values: { IsVisible: true, IsEditable: true } },
  //           { ID: 5, Name: 'Node 5', Values: { IsVisible: false, IsEditable: false } },
  //           { ID: 6, Name: 'Node 6', Values: { IsVisible: true, IsEditable: true } },
  //         ]
  //       }
  //     ],
  //   },
  //   'fa fa-user',
  //   ...IsSelectField.visibleEditable()
  // );


  constructor() { }

  ngOnInit() {
    console.log(this.tree1);
  }

  onTreeChangeInstantSave(event: IsDXSelectTreeChangeEvent) {
    console.log('selection changed', event);
    setTimeout(() => {
      console.log('save finished');
      event.saveFinished();
    }, 500);
  }

}
