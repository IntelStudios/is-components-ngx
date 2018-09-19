import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  demos: any[] = [
    { title: 'Select', route: '/select' },
    { title: 'Codemirror', route: '/codemirror' },
    { title: 'Froala', route: '/froala' }
  ];

}
