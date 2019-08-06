import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { IsCheckmapTreeNode } from '../is-checkmap.interfaces';

@Component({
  selector: 'iscm-tree',
  templateUrl: './iscm-tree.component.html',
  styleUrls: ['./iscm-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IscmTreeComponent implements OnInit {

  @Input()
  root: IsCheckmapTreeNode

  constructor() { }

  ngOnInit() {
  }

}
