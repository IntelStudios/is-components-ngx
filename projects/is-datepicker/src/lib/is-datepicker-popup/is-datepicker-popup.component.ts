import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

export interface DatepickerPopupControl {
  value: Date;
  onChange: (value: Date) => void;
}

@Component({
  selector: 'is-datepicker-popup',
  templateUrl: './is-datepicker-popup.component.html',
  styleUrls: ['./is-datepicker-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsDatepickerPopupComponent implements OnInit {

  control: DatepickerPopupControl;

  value: Date;

  constructor() { }

  ngOnInit() {
    this.value = this.control.value;
  }

  onValueChange($event: Date) {
    if ($event !== this.value) {
      this.control.onChange($event);
    }

  }
}
