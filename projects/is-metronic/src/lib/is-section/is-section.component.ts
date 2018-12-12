import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'is-section',
  templateUrl: './is-section.component.html',
  styleUrls: ['./is-section.component.scss'],
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
  heading: string;

  @Input()
  enableCollapse: boolean = false;

  collapse: string = 'open';

  constructor(private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.id) {
      const setting = localStorage.getItem(`is-section:${this.id}`);
      this.collapse = ['open','closed'].indexOf(setting) < 0 ? 'open' : setting;
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
