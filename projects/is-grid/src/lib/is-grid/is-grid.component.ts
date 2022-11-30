import { animate, state, style, transition, trigger } from '@angular/animations';
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
  Inject
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
//import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Observable, of, Subscription, timer } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';

import {
  IsGridDataRow,
  IsGridModel,
  IsGridModelCell,
  IIsGridConfig,
  IsGridConfig
} from '../is-grid.interfaces';

export const configToken = new InjectionToken<IIsGridConfig>('IsGridConfig');


@Component({
  selector: 'is-grid',
  templateUrl: './is-grid.component.html',
  styleUrls: ['./is-grid.component.scss'],
  //viewProviders: [DragulaService],
  animations: [
    trigger('collapsed', [
      state('true', style({ height: '0px' })),
      state('false', style({ height: '*' })),
      transition('false => true', [
        style({ height: '*' }),
        animate(250, style({ height: 0 }))
      ]),
      transition('true => false', [
        animate(250)
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsGridComponent implements OnInit, OnDestroy {

  @Input()
  set rows(data: Array<IsGridDataRow>) {
    if (!data) {
      this._rows = [];
      return;
    }
    this._rows = data;
    const pattern: RegExp = new RegExp(/\[(\w+)_(.+)\]/);
    if (data) {
      this.length = data.length;

      this.refresh();

      this._rows.forEach((row: any, index: number) => {
        row.$collapsed = this.collapseMode ? 'true' : 'false';
      });
      if (this.gridModel) {
        this._rows.forEach((row: any) => {
          this.gridModel.cells.forEach((c: IsGridModelCell) => {
            if (c.ProcessValue) {
              let val: string = row[c.ColumnName];
              const match: string[] = val.match(pattern);
              if (match) {
                row[c.ColumnName] = val.replace(pattern, '');
                row['$$' + c.ColumnName] = `${row[c.ColumnName]}
                  <span class="badge datagrid-badge badge-${match[1].toLowerCase()} badge-roundless" >${match[2]}</span>`;
              }
            }
          });
        });
      }
    } else {
      this.length = 0;
    }
  }
  get rows(): Array<IsGridDataRow> {
    return this._rows;
  }

  @Input()
  id: string = DatagridConfig.GLOBAL_ID;

  @Input()
  set gridModel(value: IsGridModel) {
    this._gridModel = value;
    if (value) {
      // trigger row processing
      this.rows = this.rows;
    }
  }
  get gridModel(): IsGridModel {
    return this._gridModel;
  }

  private _gridModel: IsGridModel;


  @Input()
  enableToolbar: boolean = true;

  @Input()
  maxHeight: string;

  @Input()
  canAutoRefresh: boolean = true;

  @Input()
  canReload: boolean = true;

  @Input()
  canCheck: boolean;

  @Input()
  canSearch: boolean = true;

  @Input()
  canCollapse: boolean = true;


  @Input()
  canSelectRow: boolean = true;

  @Input()
  canFilterActive: boolean = true;

  @Output()
  rowSelected: EventEmitter<any>;

  @Output()
  rowsChecked: EventEmitter<any[]>;

  @Output()
  requestReload: EventEmitter<any>;

  @Output()
  rowsReordered: EventEmitter<IsGridDataRow[]>;

  @Output()
  activeFilterChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  data: Array<any> = [];

  _rows: Array<IsGridDataRow> = [];

  page: number = 1;
  pageSize: number = 15;
  maxSize: number;
  numPages: number;
  length: number = 0;
  collapseMode: boolean = false;
  searchControl: FormControl;
  pageSizeControl: FormControl;
  autoRefreshControl: FormControl;
  statusText: string;
  pageSizeOptions: any[];
  private config: DatagridConfig;


  private _rowCollapseSub: Subscription;
  private _rowExpandSub: Subscription;
  private _autoRefreshSub: Subscription;
  private _subs: Subscription[] = [];
  private _showInactive: boolean = false;


  constructor(
    @Optional() @Inject(configToken) public gridConfig: IIsGridConfig,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    //private dragula: DragulaService
  ) {
    if (!this.gridConfig) {
      this.gridConfig = IsGridConfig.default();
    }

    ['canAutoRefresh', 'canSelectRow', 'canCollapse', 'canFilterActive', 'canReload'].forEach(key => {
      if (this.gridConfig[key] !== undefined) {
        this[key] = this.gridConfig[key];
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
    this.autoRefreshControl = new FormControl();
    this.rowSelected = new EventEmitter();
    this.requestReload = new EventEmitter();
    this.rowsChecked = new EventEmitter<IsGridDataRow[]>();
    this.rowsReordered = new EventEmitter<IsGridDataRow[]>();
    this.maxSize = 5;
    this.numPages = 1;
  }

  ngOnInit() {
    if (this.id === DatagridConfig.GLOBAL_ID) {
      console.warn('is-grid component was initialized with [id] unset');
    }
    this.config = DatagridConfig.load(this.id);

    this.pageSize = this.config.pageSize;
    this.collapseMode = this.config.collapseMode;
    if (!this.rows || this.rows.length === 0) {
      this.statusText = this.translate.instant(this.gridConfig.translations.status, { start: 0, end: 0, total: 0 });
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

    sub = this.autoRefreshControl.valueChanges
      .subscribe((newValue: boolean) => {
        this.config.autoRefresh = newValue;
        if (this._autoRefreshSub) {
          this._autoRefreshSub.unsubscribe();
        }
        if (newValue === true) {
          this._autoRefreshSub = timer(15 * 1000, 15 * 1000)
            .subscribe(() => {
              this.reload();
            });
        }
        this.config.save();
      });
    this._subs.push(sub);
    this.autoRefreshControl.setValue(this.config.autoRefresh);


    // this.dragula.setOptions('order', {
    //   revertOnSpill: true,
    //   copy: false,
    //   moves: function(el, container, handle) {
    //     return handle.className && handle.className.startsWith('order-handle fa fa-bars');
    //   },
    // });

    // this.dragula.drop.subscribe(value => {
    //   const [bag, el, , , sibling] = value;
    //   if (bag === 'order') {
    //     //console.debug(bag, el, target, source, sibling);
    //     const id: number = Number(el.id);
    //     const sourceRowIndex: number = this.rows.findIndex((item: GridDataRow) => item.ID === id);
    //     const sourceRow: any = this.rows[sourceRowIndex];
    //     if (sibling) {
    //       const siblingId: number = Number(sibling.id);
    //       let siblingIndex: number = this.rows.findIndex((s: GridDataRow) => s.ID === siblingId);
    //       if (sourceRowIndex < siblingIndex) {
    //         // we'l remove source for first
    //         // so we need to decrease target index
    //         siblingIndex--;
    //       }
    //       this.rows.splice(sourceRowIndex, 1);
    //       this.rows.splice(siblingIndex, 0, sourceRow);
    //       this.rowsReordered.emit(this.rows);
    //     } else {
    //       // moved to last position
    //       let maxIndex: number = this.data.length - 1; // use data instead of rows, because data is actually what user can see
    //       if (this.page > 1) {
    //         maxIndex = (this.page * (this.pageSize - 1) + this.data.length) - 1;
    //       }
    //       this.rows.splice(sourceRowIndex, 1);
    //       this.rows.push(sourceRow);
    //       this.rowsReordered.emit(this.rows);
    //     }
    //   }
    // });
  }

  ngOnDestroy() {

    this._subs.forEach((s: Subscription) => s.unsubscribe());
    if (this._rowCollapseSub) {
      this._rowCollapseSub.unsubscribe();
    }
    if (this._rowExpandSub) {
      this._rowExpandSub.unsubscribe();
    }
    if (this._autoRefreshSub) {
      this._autoRefreshSub.unsubscribe();
    }
    // this.dragula.destroy('order');
  }

  getHeight() {
    return this.maxHeight ? this.maxHeight : 'auto';
  }

  trackByFunction(item, index) {
    return item.ID;
  }

  refresh() {
    this.data = this.changePage({ page: this.page, itemsPerPage: this.pageSize }, this._rows);
    this.changeDetector.markForCheck();
  }

  showInactiveToggle($event: Event) {
    this._showInactive = $event.target['checked'];
    this.onChangeTable({ page: this.page, itemsPerPage: this.pageSize });
    this.activeFilterChange.emit(!this._showInactive);
  }

  reload() {
    this.requestReload.emit(null);
  }

  // actionClick(action: GridActionModel, rowId: number) {
  //   this.dirtyPageService.canDeactivate()
  //     .subscribe((result: boolean) => {
  //       if (result === true) {
  //         action.select(rowId);
  //       }
  //     });
  // }

  allChecked($event: Event) {
    const checked = ($event.target as HTMLInputElement).checked;
    this.rows.forEach((row: any) => {
      row.$checked = checked;
    });
    this.rowsChecked.emit(checked ? this.rows : []);
  }

  onRowChecked(row: IsGridDataRow) {
    row.$checked = row.$checked ? false : true;
    let checked = this.rows.filter((item: any) => item.$checked === true);
    this.rowsChecked.emit(checked);
  }

  onRowSelected(row: IsGridDataRow) {
    if (this.canSelectRow) {
      this.rowSelected.emit(row);
    }
  }

  onChangeTable($event: any) {
    this.data = this.changePage($event);
    this.changeDetector.markForCheck();
  }

  toggleColapseMode() {
    this.collapseMode = !this.collapseMode;
    this.rows.forEach((row: any) => {
      row.$collapsed = this.collapseMode ? 'true' : 'false';
    });
    this.config.collapseMode = this.collapseMode;
    this.changeDetector.markForCheck();
    this.config.save();
  }

  collapseRow(row: any) {
    if (this.canCollapse && this.collapseMode) {
      if (this._rowExpandSub) {
        this._rowExpandSub.unsubscribe();
      }
      this._rowCollapseSub = of(null).pipe(
        delay(75))
        .subscribe(() => {
          row.$collapsed = 'true';
          this.changeDetector.markForCheck();
        });
    }
  }

  expandRow(row: any) {
    if (this.canCollapse && this.collapseMode) {
      if (this._rowExpandSub) {
        this._rowExpandSub.unsubscribe();
      }
      this._rowExpandSub = of(null).pipe(
        delay(75))
        .subscribe(() => {
          row.$collapsed = 'false';
          this.changeDetector.markForCheck();
        });
    }
  }


  private filterRows(rows: Array<IsGridDataRow>): Array<IsGridDataRow> {
    let filtered = rows;
    if (this.canFilterActive) {
      filtered = rows.filter((row: IsGridDataRow) => {
        if (this._showInactive && !row.$isActive) {
          return row;
        }
        if (!this._showInactive && row.$isActive) {
          return row;
        }
      });
    }

    if (this.searchControl.value) {
      console.time('filter')
      let f: string = '';
      if (this.searchControl.value) {
        f = this.searchControl.value.toLowerCase();
      }
      filtered = filtered.filter((item: IsGridDataRow) => {
        const accept = f ? item.accepts(f) : true;
        return accept;
      });
      console.timeEnd('filter')
      return filtered;
    }
    return filtered;
  }

  private changePage(page: any, rows: Array<any> = this.rows): Array<any> {
    const rowsFiltered: Array<any> = this.filterRows(rows);
    this.length = rowsFiltered.length;
    let start = (page.page - 1) * page.itemsPerPage;
    if (start >= this.length) {
      this.page = 1;
      start = 0;
    }
    const end = page.itemsPerPage > -1 ? Math.min((start + page.itemsPerPage), this.length) : this.length;
    const statusParams = { totalFiltered: this.length, start: start + 1, end: end, total: rows.length };
    if (rowsFiltered.length === rows.length) {
      this.statusText = this.translate.instant(this.gridConfig.translations.status, statusParams);
    } else {
      if (rowsFiltered.length > 0) {
        this.statusText = this.translate.instant(this.gridConfig.translations.statusFiltered, statusParams);
      } else {
        this.statusText = this.translate.instant(this.gridConfig.translations.statusNoMatch, statusParams);
      }
    }
    return rowsFiltered.slice(start, end);
  }
}

export class DatagridConfig {
  static GLOBAL_ID: string = 'global';
  private static globalProperties = ['pageSize'];
  id: string;
  pageSize: number = 15;
  autoRefresh: boolean = false;
  searchFilter: string = null;
  collapseMode: boolean = false;
  filters: any = { ID: 1 };

  static load(id: string): DatagridConfig {
    let global: DatagridConfig = DatagridConfig.loadGlobal();
    let config: DatagridConfig = DatagridConfig.loadConfig(id);

    DatagridConfig.globalProperties.forEach((key: string) => {
      config[key] = global[key];
    });
    // reset no longer supported value
    if (config.pageSize < 0) {
      config.pageSize = 15;
    }
    return config;
  }

  private static loadConfig(id: string) {
    let obj: DatagridConfig = new DatagridConfig();
    obj.id = 'is-grid:' + id;
    let savedDefaults = localStorage.getItem(obj.id);
    if (savedDefaults !== null) {
      Object.assign(obj, JSON.parse(savedDefaults));
    }
    return obj;
  }

  private static loadGlobal(): DatagridConfig {
    return DatagridConfig.loadConfig(DatagridConfig.GLOBAL_ID);
  }

  save() {
    localStorage.setItem(this.id, JSON.stringify(this));
    let global: DatagridConfig = DatagridConfig.loadGlobal();
    DatagridConfig.globalProperties.forEach((key: string) => {
      global[key] = this[key];
    });
    localStorage.setItem('is-grid:' + DatagridConfig.GLOBAL_ID, JSON.stringify(global));
  }
}



