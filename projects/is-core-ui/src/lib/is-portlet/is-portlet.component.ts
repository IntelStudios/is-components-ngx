import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

import { IsPortletTitleDirective } from './is-portlet.directives';

type PortletCollapsed = 'open' | 'closed';

@Component({
  selector: 'is-portlet, is-section',
  templateUrl: './is-portlet.component.html',
  styleUrls: ['./is-portlet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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
  showHeader: boolean = true;

  @Input()
  heading: string;

  @Input()
  headingClass: string = '';

  @Input()
  icon: string;

  @Input()
  enableCollapse: boolean = false;

  @ContentChild(IsPortletTitleDirective, { static: true })
  templateTitle: IsPortletTitleDirective;

  /**
   * set true to initially collapse the section, false to expand it
   */
  @Input()
  collapsed: PortletCollapsed = 'open';

  /**
   * emits when Porltet is collapsed (true) / expanded (false) by user
   */
  @Output()
  collapseChange: EventEmitter<boolean> = new EventEmitter();

  isSection: boolean;

  constructor(private changeDetector: ChangeDetectorRef, private el: ElementRef) {

  }

  ngOnInit() {
    this.isSection = this.el.nativeElement.localName === 'is-section';
    if (this.id) {
      const setting = localStorage.getItem(`is-portlet:${this.id}`);
      this.collapsed = ['open', 'closed'].indexOf(setting) < 0 ? 'open' : setting as PortletCollapsed;
    }
  }

  toggleCollapse() {
    this.collapsed = this.collapsed === 'open' ? 'closed' : 'open';
    if (this.id) {
      localStorage.setItem(`is-portlet:${this.id}`, this.collapsed);
    }
    this.collapseChange.next(this.collapsed === 'closed');
    this.changeDetector.markForCheck();
  }
}
