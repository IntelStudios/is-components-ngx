import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectItem } from './select-item';


describe('SelectItem', () => {


  it('should getID() (number)', () => {
    const item = new SelectItem({ID: '123', Value: '1234'})
    expect(item.getID(true)).toBe(123);
  });

  it('should getID() (number)', () => {
    const item = new SelectItem({ID: 123, Value: '1234'})
    expect(item.getID(true)).toBe(123);
  });

  it('should getID() (string)', () => {
    const item = new SelectItem({ID: '001', Value: '1234'})
    expect(item.getID(true)).toBe('001');
  });

  it('should getID() (string)', () => {
    const item = new SelectItem({ID: '1_2', Value: '1234'})
    expect(item.getID(true)).toBe('1_2');
  });

  it('should getID() (string)', () => {
    const item = new SelectItem({ID: '01_2', Value: '1234'})
    expect(item.getID(true)).toBe('01_2');
  });

});
