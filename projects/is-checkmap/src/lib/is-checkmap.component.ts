import { Component, OnInit, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { IsCheckmapTreeNode } from './is-checkmap.interfaces';

@Component({
  selector: 'is-checkmap',
  templateUrl: './is-checkmap.component.html',
  styleUrls: ['./is-checkmap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsCheckmapComponent implements OnInit {

  tree: IsCheckmapTreeNode = {
    ID: 1, EntityName: 'Root', Children: [
      {
        ID: 11, EntityName: '11', Children: [
          { ID: 21, EntityName: '21 asdfasdfs' },
          { ID: 22, EntityName: '22ad fadf ' },
          { ID: 23, EntityName: '23 adsf' },
        ]
      },
      { ID: 12, EntityName: '12  node with quite a long name' },
      { ID: 13, EntityName: '13' },
    ]
  };


  private elLeft: HTMLDivElement;
  private elTop: HTMLDivElement;
  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  ngOnInit() {
    this.elLeft = this.el.nativeElement.querySelector('.left');
    this.elTop = this.el.nativeElement.querySelector('.top');
  }

  onScroll($event) {
    this.elLeft.scrollTop = $event.target.scrollTop;
    this.elTop.scrollLeft = $event.target.scrollLeft;
  }

  test() {

    const left = this.el.nativeElement.querySelector('.left');
    left.scrollTop = 100;
  }
}
