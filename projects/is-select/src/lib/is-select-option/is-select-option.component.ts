import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input, TemplateRef, Output, ChangeDetectorRef, HostBinding } from '@angular/core';
import { SelectItem } from '../select-item';
import { IsSelectOptionsService } from '../is-select.options.service';
import { Observable } from 'rxjs';
import { ISelectOptionsControl } from '../is-select-options/is-select-options.component';

@Component({
  selector: 'is-select-option',
  templateUrl: './is-select-option.component.html',
  styleUrls: ['./is-select-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsSelectOptionComponent implements OnInit {

  @Input()
  option: SelectItem;

  @Input()
  control: ISelectOptionsControl;

  @HostBinding('class')
  @Input()
  alignment: string;

  @Input()
  level = 0;

  @Input()
  optionTemplate: TemplateRef<any>;

  isActive$: Observable<boolean>;
  isSelected$: Observable<boolean>;

  @HostBinding('class.multiple')
  multiple: boolean;

  constructor(private optionsService: IsSelectOptionsService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.multiple = !!this.control.multipleConfig;
    this.isActive$ = this.optionsService.isActive(this.option);
    this.isSelected$ = this.optionsService.isSingleValueSelected(this.option);
  }

  selectActive() {
    this.optionsService.setActiveOption(this.option);
  }

  selectMatch(e: Event = void 0) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    // in single mode value will never have Checked property set
    this.option.Checked ? this.control.onItemUnselected(this.option) : this.control.onItemSelected(this.option);
    // only close options in single mode
    !this.control.multipleConfig && this.control.onClosed();
    this.cd.markForCheck();
  }

}
