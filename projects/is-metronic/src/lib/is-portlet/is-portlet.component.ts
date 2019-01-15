import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef, ContentChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

import { IsPortletTitleDirective } from './is-portlet.directives';

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
  icon: string;
  @Input()
  fontColor: string = 'font-green-seagreen';

  @Input()
  heading: string;
  @Input()
  headingUpprcase: boolean = true;
  @Input()
  headingBold: boolean = true;

  @Input()
  enableCollapse: boolean = false;

  @ContentChild(IsPortletTitleDirective, { read: TemplateRef })
  templateTitle: IsPortletTitleDirective;

  collapse: string = 'open';

  constructor(private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.id) {
      const setting = localStorage.getItem(`is-portlet:${this.id}`);
      this.collapse = ['open','closed'].indexOf(setting) < 0 ? 'open' : setting;
    }
  }

  toggleCollapse() {
    this.collapse = this.collapse === 'open' ? 'closed' : 'open';
    if (this.id) {
      localStorage.setItem(`is-portlet:${this.id}`, this.collapse);
    }
    this.changeDetector.markForCheck();
  }
}
