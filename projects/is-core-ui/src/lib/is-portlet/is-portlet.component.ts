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
} from '@angular/core';

import { IsPortletTitleDirective } from './is-portlet.directives';

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

  @ContentChild(IsPortletTitleDirective, { read: TemplateRef, static: true })
  templateTitle: IsPortletTitleDirective;

  @Input()
  set collapse(value: boolean){
    if (value) {
      this._collapse = 'open';
    } else {
      this._collapse = 'closed';
    }
    this.changeDetector.markForCheck();
  }
  _collapse: string = 'open';

  isSection: boolean;

  constructor(private changeDetector: ChangeDetectorRef, private el: ElementRef) {

  }

  ngOnInit() {
    this.isSection = this.el.nativeElement.localName === 'is-section';
    if (this.id) {
      const setting = localStorage.getItem(`is-portlet:${this.id}`);
      this._collapse = ['open', 'closed'].indexOf(setting) < 0 ? 'open' : setting;
    }
  }

  toggleCollapse() {
    this._collapse = this._collapse === 'open' ? 'closed' : 'open';
    if (this.id) {
      localStorage.setItem(`is-portlet:${this.id}`, this._collapse);
    }
    this.changeDetector.markForCheck();
  }
}
