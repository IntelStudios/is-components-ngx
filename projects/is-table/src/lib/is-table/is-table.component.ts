import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  InjectionToken,
  Optional,
  Inject,
  TemplateRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  IsTableRow,
  IsTableColumn,
  IIsTableConfig,
  IsTableConfig
} from '../is-table.interfaces';
import { IsTableColumnDirective, IsTableActionsColumnDirective } from '../is-table.directives';

export const configToken = new InjectionToken<IIsTableConfig>('IsTableConfig');


@Component({
  selector: 'is-table',
  templateUrl: './is-table.component.html',
  styleUrls: ['./is-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsTableComponent implements OnInit, OnDestroy {

  @Input()
  canSelectRow: boolean = true;

  @Input()
  searchItems: Array<string> = [];

  @Input()
  showActionButtons: boolean = true;

  @Input()
  canDisableRow: boolean = false;

  @Input()
  canSearch: boolean = true;

  @Input()
  canPaging: boolean = true;

  @Input()
  columns: Array<IsTableColumn>;

  @Input()
  set rows(items: Array<IsTableRow>) {
    if (!items) {
      this._rows = [];
      return;
    }
    this._rows = items;

    const pattern: RegExp = new RegExp(/\[(\w+)_(.+)\]/);
    if (items) {
      this.length = items.length;

      this._rows.forEach((row: IsTableRow) => {
        Object.keys(row.Data).forEach((key: string) => {
          const data: any = row.Data[key];

          if (typeof(data) === "string") {
            const match: Array<string> = data.toString().match(pattern);
            if (match) {
              row.Data[key] = `<span class="badge datagrid-badge badge-${match[1].toLowerCase()} badge-roundless">${match[2]}</span>`;
              if (this.searchItems.length === 0 || this.searchItems.indexOf(key) > -1) {
                row.$searchString += match[2].toLowerCase() + '|';
              }
            }
            else {
              if (this.searchItems.length === 0 || this.searchItems.indexOf(key) > -1) {
                row.$searchString += row.Data[key].toLowerCase() + '|';
              }
            }
          }
        });
      });
    } else {
      this.length = 0;
    }

    this.refresh();
  }
  get rows(): Array<IsTableRow> {
    return this._rows;
  }

  @Input()
  id: string = DatatableConfig.GLOBAL_ID;

  @Input()
  enableToolbar: boolean = true;

  @Output()
  rowSelected: EventEmitter<IsTableRow>;

  @Output()
  rowTrashClicked: EventEmitter<IsTableRow>;

  data: Array<IsTableRow> = [];

  _rows: Array<IsTableRow> = [];

  page: number = 1;
  pageSize: number = 15;
  maxSize: number = 5;
  numPages: number;
  length: number = 0;
  statusText: string;
  searchControl: FormControl;
  pageSizeControl: FormControl;

  pageSizeOptions: any[];
  private config: DatatableConfig;

  private _subs: Subscription[] = [];

  @ContentChild(IsTableColumnDirective, { read: TemplateRef })
  templateColumn: IsTableColumnDirective;

  @ContentChild(IsTableActionsColumnDirective, { read: TemplateRef })
  templateActionsColumn: IsTableActionsColumnDirective;

  constructor(
    @Optional() @Inject(configToken) public tableConfig: IIsTableConfig,
    private changeDetector: ChangeDetectorRef,
    public translate: TranslateService
  ) {

    if (!this.tableConfig) {
      this.tableConfig = IsTableConfig.default();
    }

    ['canSelectRow', 'searchItems'].forEach(key => {
      if (this.tableConfig[key] !== undefined) {
        this[key] = this.tableConfig[key];
      }
    });

    this.pageSizeOptions = [
      { ID: 15, Value: '15' },
      { ID: 30, Value: '30' },
      { ID: 50, Value: '50' },
      { ID: 100, Value: '100' }
    ];

    this.searchControl = new FormControl();
    this.pageSizeControl = new FormControl();
    this.rowSelected = new EventEmitter();
    this.rowTrashClicked = new EventEmitter();
  }

  ngOnInit() {
    if (this.id === DatatableConfig.GLOBAL_ID) {
      console.warn('is-table component was initialized with [id] unset');
    }
    this.config = DatatableConfig.load(this.id);

    this.pageSize = this.config.pageSize;
    if (!this.rows || this.rows.length === 0) {
      this.statusText = this.translate.instant(this.tableConfig.translations.status, { start: 0, end: 0, total: 0 });
    }
    let sub: Subscription;

    sub = this.searchControl.valueChanges.pipe(
      debounceTime(200))
      .subscribe((newValue: string) => {
        this.config.searchFilter = newValue;
        this.config.save();
        this.onChangeTable({ page: this.page, itemsPerPage: this.pageSize });
      });
    this._subs.push(sub);

    sub = this.pageSizeControl.valueChanges
      .subscribe((newValue: string) => {
        this.pageSize = Number(newValue);
        this.config.pageSize = this.pageSize;
        this.config.save();
        this.onChangeTable({ page: this.page, itemsPerPage: this.pageSize });
      });
    this._subs.push(sub);

    this.searchControl.setValue(this.config.searchFilter, { emitEvent: this._rows.length > 0 });
    this.pageSizeControl.setValue(this.config.pageSize, { emitEvent: this._rows.length > 0 });
  }

  refresh() {
    this.data = this.changePage({ page: this.page, itemsPerPage: this.pageSize }, this._rows);
    this.changeDetector.markForCheck();
  }

  onRowSelected(row: IsTableRow) {
    if (this.canSelectRow) {
      this.rowSelected.emit(row);
    }
  }

  onChangeTable($event: any) {
    this.data = this.changePage($event);
    this.changeDetector.markForCheck();
  }

  onRowTrashClicked(row: IsTableRow) {
    if (row.CanDisable) {
      this.rowTrashClicked.emit(row);
    }
  }

  private filterRows(rows: Array<IsTableRow>): Array<IsTableRow> {
    if (this.searchControl.value) {
      let f: string = '';
      if (this.searchControl.value) {
        f = this.searchControl.value.toLowerCase();
      }
      rows = rows.filter((item: IsTableRow) => {
        let accept = false;

        if (!accept) {
          accept = f ? item.$searchString.indexOf(f) > -1 : true;
        }
        return accept;
      });
      return rows;
    }
    return rows;
  }

  private changePage(page: any, rows: Array<IsTableRow> = this.rows): Array<IsTableRow> {
    const rowsFiltered: Array<IsTableRow> = this.filterRows(rows);
    this.length = rowsFiltered.length;
    let start = (page.page - 1) * page.itemsPerPage;
    if (start >= this.length) {
      this.page = 1;
      start = 0;
    }
    const end = page.itemsPerPage > -1 ? Math.min((start + page.itemsPerPage), this.length) : this.length;
    const statusParams = { totalFiltered: this.length, start: start + 1, end: end, total: rows.length };
    if (rowsFiltered.length === rows.length) {
      this.statusText = this.translate.instant(this.tableConfig.translations.status, statusParams);
    } else {
      if (rowsFiltered.length > 0) {
        this.statusText = this.translate.instant(this.tableConfig.translations.statusFiltered, statusParams);
      } else {
        this.statusText = this.translate.instant(this.tableConfig.translations.statusNoMatch, statusParams);
      }
    }
    return rowsFiltered.slice(start, end);
  }

  ngOnDestroy() {
    if (this._subs) {
      this._subs.forEach((sub: Subscription) => {
        sub.unsubscribe();
      })
    }
  }
}

export class DatatableConfig {
  static GLOBAL_ID: string = 'global';
  private static globalProperties = ['pageSize'];
  id: string;
  pageSize: number = 15;
  searchFilter: string = null;
  filters: any = { ID: 1 };

  static load(id: string): DatatableConfig {
    let global: DatatableConfig = DatatableConfig.loadGlobal();
    let config: DatatableConfig = DatatableConfig.loadConfig(id);

    DatatableConfig.globalProperties.forEach((key: string) => {
      config[key] = global[key];
    });
    // reset no longer supported value
    if (config.pageSize < 0) {
      config.pageSize = 15;
    }
    return config;
  }

  private static loadConfig(id: string) {
    let obj: DatatableConfig = new DatatableConfig();
    obj.id = 'is-table:' + id;
    let savedDefaults = localStorage.getItem(obj.id);
    if (savedDefaults !== null) {
      Object.assign(obj, JSON.parse(savedDefaults));
    }
    return obj;
  }

  private static loadGlobal(): DatatableConfig {
    return DatatableConfig.loadConfig(DatatableConfig.GLOBAL_ID);
  }

  save() {
    localStorage.setItem(this.id, JSON.stringify(this));
    let global: DatatableConfig = DatatableConfig.loadGlobal();
    DatatableConfig.globalProperties.forEach((key: string) => {
      global[key] = this[key];
    });
    localStorage.setItem('is-table:' + DatatableConfig.GLOBAL_ID, JSON.stringify(global));
  }
}


