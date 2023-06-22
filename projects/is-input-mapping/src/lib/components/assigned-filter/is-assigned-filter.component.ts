import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FilterValueFormatter, IsInputSchemaFilter } from '../../is-input-mapping.interface';
import { FILTER_DEFS } from '../../models';


@Component({
  selector: 'is-assigned-filter',
  templateUrl: './is-assigned-filter.component.html',
  styleUrls: ['./is-assigned-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsAssignedFilterComponent {

  @Input()
  filters: IsInputSchemaFilter[];

  @Input()
  showOnlyFiltered = false;

  @Input()
  disabled = false;

  @Input()
  filterValueFormatter: FilterValueFormatter;

  @Output()
  onRelease: EventEmitter<IsInputSchemaFilter> = new EventEmitter<IsInputSchemaFilter>();

  filterDefs = FILTER_DEFS;

  constructor() {
  }

  release(filter: IsInputSchemaFilter) {
   this.onRelease.emit(filter);
  }


}
