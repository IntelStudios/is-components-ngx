import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'is-portlet',
  templateUrl: './is-portlet.component.html',
  styleUrls: ['./is-portlet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('collapseInOut', [
      state('open', style({
        overflow: 'hidden',
        height: '*',
      })),
      state('closed', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
        width: '0px'
      })),
      transition('closed => open', animate('250ms ease-in-out')),
      transition('open => closed', animate('250ms ease-in-out'))
    ])
  ]
})
export class IsPortletComponent implements OnInit {

  @Input()
  id: string;

  @Input()
  enableCollapse: boolean = false;

  @Input()
  heading: string;

  collapse: string = 'open';

  constructor(private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.id) {
      this.collapse = localStorage.getItem(`portlet:${this.id}`) || 'open';
    }
  }

  toggleCollapse() {
    this.collapse = this.collapse === 'open' ? 'closed' : 'open';
    if (this.id) {
      localStorage.setItem(`portlet:${this.id}`, this.collapse);
    }
    this.changeDetector.markForCheck();
  }
}
