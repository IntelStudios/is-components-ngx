import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Routes, withHashLocation } from '@angular/router';
import { provideIsCdk } from 'projects/is-cdk/src/public-api';
import { provideIsCoreUi } from 'projects/is-core-ui/src/public_api';
import { provideIsCronEditor } from 'projects/is-cron-editor/src/public_api';
import { provideIsDatepicker } from 'projects/is-datepicker/src/public_api';
import { provideIsFroala } from 'projects/is-froala/src/public_api';
import { provideIsSelect } from 'projects/is-select/src/public_api';
import { provideIsSelectTree } from 'projects/is-select-tree/src/public_api';
import { provideIsTimepicker } from 'projects/is-timepicker/src/public_api';

const routes: Routes = [
  { path: 'select', loadComponent: () => import('./demo-select/demo-select/demo-select.component').then(m => m.DemoSelectComponent) },
  { path: 'datepicker', loadComponent: () => import('./demo-datepicker/demo-datepicker/demo-datepicker.component').then(m => m.DemoDatepickerComponent) },
  { path: 'froala', loadComponent: () => import('./demo-froala/demo-froala/demo-froala.component').then(m => m.DemoFroalaComponent) },
  { path: 'core-ui', loadComponent: () => import('./demo-core-ui/demo-core-ui/demo-core-ui.component').then(m => m.DemoCoreUIComponent) },
  { path: 'select-tree', loadComponent: () => import('./demo-select-tree/demo-select-tree/demo-select-tree.component').then(m => m.DemoSelectTreeComponent) },
  { path: 'timepicker', loadComponent: () => import('./demo-timepicker/demo-timepicker/demo-timepicker.component').then(m => m.DemoTimepickerComponent) },
  { path: 'croneditor', loadComponent: () => import('./demo-cron-editor/demo-cron-editor/demo-cron-editor.component').then(m => m.DemoCronEditorComponent) },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideIsCdk(),
    provideIsCoreUi(),
    provideIsSelect({ allowClear: true }),
    provideIsFroala({ getLicense: () => '' }),
    provideIsDatepicker(),
    provideIsTimepicker(),
    provideIsSelectTree(),
    provideIsCronEditor(),
  ],
};
