import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Input, TemplateRef } from '@angular/core';

import { IsSectionTitleDirective } from './is-section.directives';

@Component({
  selector: 'is-section',
  templateUrl: './is-section.component.html',
  styleUrls: ['./is-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('collapseInOut', [
      state('open', style({
        height: '*',
      })),
      state('closed', style({
        opacity: '0',
        height: '0px'
      })),
      transition('closed => open', animate('250ms ease-in-out')),
      transition('open => closed', animate('250ms ease-in-out'))
    ])
  ]
})
export class IsSectionComponent {

  @Input()
  id: string;

  @Input()
  icon: string;

  @Input()
  portletClass: string = 'blue-hoki';

  @Input()
  titleClass: string = '';

  @Input()
  heading: string;

  @Input()
  enableCollapse: boolean = false;

  @Input()
  smallCaret: boolean = false;

  @Input()
  set defaultBorder(value: boolean) {
    if (value) {
      this.borderStyle = '1px solid #e7ecf1';
    }
  }

  @ContentChild(IsSectionTitleDirective, { read: TemplateRef, static: true })
  templateTitle: IsSectionTitleDirective;

  collapse: string = 'open';
  borderStyle: string;

  constructor(private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.id) {
      const setting = localStorage.getItem(`is-section:${this.id}`);
      this.collapse = ['open', 'closed'].indexOf(setting) < 0 ? 'open' : setting;
    }
  }

  toggleCollapse() {
    this.collapse = this.collapse === 'open' ? 'closed' : 'open';
    if (this.id) {
      localStorage.setItem(`is-section:${this.id}`, this.collapse);
    }
    this.changeDetector.markForCheck();
  }
}
