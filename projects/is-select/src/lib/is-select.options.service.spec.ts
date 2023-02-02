import { TestBed } from '@angular/core/testing';

import { IsSelectOptionsService } from './is-select.options.service';
import {SelectItem} from './select-item';
import {first, skip} from 'rxjs/operators';

describe('IsSelectOptionsService', () => {
  let service: IsSelectOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [IsSelectOptionsService]});
    service = TestBed.inject(IsSelectOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('should set correct active option', () => {
    service.setActiveOption(new SelectItem('test1'));
    expect(service.activeOption.ID).toBe('test1');
  });

  it ('should correctly compare first active option', () => {
    service.isActive(new SelectItem('test1')).pipe(skip(1), first())
      .subscribe((val) => expect(val).toBe(true));
    service.setActiveOption(new SelectItem('test1'));
  });

  it ('should correctly compare second active option', () => {
    service.isActive(new SelectItem('test2')).pipe(skip(2), first())
      .subscribe((val) => expect(val).toBe(true));
    service.setActiveOption(new SelectItem('test1'));
    service.setActiveOption(new SelectItem('test2'));
  });

  it ('should correctly delete second active option', () => {
    service.isActive(new SelectItem('test2')).pipe(skip(2), first())
      .subscribe((val) => expect(val).toBe(false));
    service.setActiveOption(new SelectItem('test1'));
    service.setActiveOption(undefined);
  });

  it ('should correctly compare first selected option', () => {
    service.isSingleValueSelected(new SelectItem('test1')).pipe(skip(1), first())
      .subscribe((val) => expect(val).toBe(true));
    service.setSingleValue(new SelectItem('test1'));
  });

  it ('should correctly compare second selected option', () => {
    service.isSingleValueSelected(new SelectItem('test2')).pipe(skip(2), first())
      .subscribe((val) => expect(val).toBe(true));
    service.setSingleValue(new SelectItem('test1'));
    service.setSingleValue(new SelectItem('test2'));
  });

  it ('should correctly delete second selected option', () => {
    service.isSingleValueSelected(new SelectItem('test2')).pipe(skip(2), first())
      .subscribe((val) => expect(val).toBe(false));
    service.setSingleValue(new SelectItem('test1'));
    service.setSingleValue(undefined);
  });
});
