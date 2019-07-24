import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';

import { IsSelectTree, IsSelectField, IsSelectTreeNode, IsSelectTreeChangeEvent } from 'projects/is-select-tree/src/public_api';

@Component({
  selector: 'app-demo-select-tree',
  templateUrl: './demo-select-tree.component.html',
  styleUrls: ['./demo-select-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoSelectTreeComponent implements OnInit {

  usage: string = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-select-tree-7.0.0.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsSelectTreeModule } from 'is-select-tree';</pre>
`

  tree1: IsSelectTree = IsSelectTree.deserializeTree(
    {
      Name: 'Virtual Root',
      Children: [
        { ID: 1, Name: 'Node 1', Values: { IsSelected: true } },
        { ID: 2, Name: 'Node 2', Values: { IsSelected: false } }
      ],
    },
    null,
    IsSelectField.selected()
  );

  tree2: IsSelectTree = IsSelectTree.deserializeTree(
    {
      Name: 'Virtual Root',
      Children: [
        { ID: 1, Name: 'Node 1', Icon:'fa fa-beer', Values: { IsVisible: true, IsEditable: true } },
        { ID: 2, Name: 'Node 2' },
        {
          Name: 'Node 3 (virtual)',
          Children: [
            { ID: 4, Name: 'Node 4', Values: { IsVisible: true, IsEditable: true } },
            { ID: 5, Name: 'Node 5', Values: { IsVisible: false, IsEditable: false } },
            { ID: 6, Name: 'Node 6', Values: { IsVisible: true, IsEditable: true } },
          ]
        }
      ],
    },
    'fa fa-user',
    ...IsSelectField.visibleEditable()
  );


  constructor() { }

  ngOnInit() {

  }

  onTreeChangeInstantSave(event: IsSelectTreeChangeEvent) {
    console.log('selection changed', event);
    setTimeout(() => {
      console.log('save finished');
      event.saveFinished();
    }, 500);
  }

}
