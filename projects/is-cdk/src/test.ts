// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { NgModule, provideZonelessChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

@NgModule({
  providers: [provideZonelessChangeDetection()],
})
class ZonelessTestingModule {}

getTestBed().initTestEnvironment(
  [BrowserTestingModule, ZonelessTestingModule],
  platformBrowserTesting(),
  {
    teardown: { destroyAfterEach: false },
  },
);
