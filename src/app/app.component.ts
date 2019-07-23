import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
    { title: 'Froala', route: '/froala' },
    { title: 'Metronic', route: '/metronic' },
    { title: 'Date Picker', route: '/datepicker' },
    { title: 'Select Picker', route: '/selectpicker' },
    { title: 'Bootstrap Switch', route: '/bootstrap-switch' },
    { title: 'Password', route: '/password' },
    { title: 'Select Tree', route: '/select-tree' },
    { title: 'Select Tree DX', route: '/dx-select-tree' },
    { title: 'Modal', route: '/modal' },
    { title: 'Grid', route: '/grid' },
    { title: 'Table', route: '/table' },
    { title: 'Time Picker', route: '/timepicker' },
    { title: 'Cron editor', route: '/croneditor' },
    { title: 'Check Map', route: '/checkmap' }
  ].sort((a, b) => a.title.localeCompare(b.title));

  constructor(private translate: TranslateService) {
    // for demo purpose we just set some translations so we do not need to introduce http-loader
    translate.setTranslation('en', { 'breadcrumb': 'Breadcrumb', 'bs-switch-on': 'Yes ;-)', 'bs-switch-off': 'No :-(' })
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }
}
