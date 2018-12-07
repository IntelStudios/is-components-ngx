import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'is-password',
  templateUrl: 'is-password.component.html',
  styleUrls: ['is-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsPasswordComponent {

  @Input()
  autocomplete: any;

  @Input()
  placeholder: string = '';

  @Input()
  title: string;

  constructor() {

  }

  togglePassword(input: any) {
    input.type === 'text' ? input.type = 'password' : input.type = 'text';
  }
}
