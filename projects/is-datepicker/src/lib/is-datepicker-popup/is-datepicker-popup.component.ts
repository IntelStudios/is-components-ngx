import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';

export interface DatepickerPopupControl {
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

  @Input()
  control: DatepickerPopupControl;

  @Input()
  value: Date;

  constructor() { }

  ngOnInit() {

  }

  onValueChange($event: Date) {
    if ($event !== this.value) {
      this.control.onChange($event);
    }

  }
}
