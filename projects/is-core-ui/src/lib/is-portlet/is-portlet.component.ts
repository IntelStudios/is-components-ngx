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
import { NgClass, NgTemplateOutlet } from '@angular/common';

import { IsPortletTitleDirective } from './is-portlet.directives';

type PortletCollapsed = 'open' | 'closed';

@Component({
    selector: 'is-portlet, is-section',
    templateUrl: './is-portlet.component.html',
    styleUrls: ['./is-portlet.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [NgClass, NgTemplateOutlet],
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

  @Input()
  clickableHeader: boolean = false;

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

  toggleCollapse(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.collapsed = this.collapsed === 'open' ? 'closed' : 'open';
    if (this.id) {
      localStorage.setItem(`is-portlet:${this.id}`, this.collapsed);
    }
    this.collapseChange.next(this.collapsed === 'closed');
    this.changeDetector.markForCheck();
  }
}
