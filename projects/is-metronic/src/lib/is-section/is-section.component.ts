import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'is-section',
  templateUrl: './is-section.component.html',
  styleUrls: ['./is-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsSectionComponent {

  @Input()
  portletClass: string = 'blue-hoki';

  @Input()
  heading: string;

}
