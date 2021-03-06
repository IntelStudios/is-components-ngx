export interface IsGridTranslationsConfig {
  status: string;
  statusFiltered: string;
  statusNoMatch: string;
  pageSize: string;
  autoRefresh: string;
  showInactive: string;
  noData: string;
  search: string;
  reload: string;
}

export interface IIsGridConfig {
  canAutoRefresh?: boolean;
  canSelectRow?: boolean;
  canCollapse?: boolean;
  canFilterActive?: boolean;
  canReload?: boolean;
  translations: IsGridTranslationsConfig;
}

export class IsGridConfig {
  static default(): IIsGridConfig {
    return {
      translations: {
        status: 'Showing {{start}} to {{end}} of {{total}} records',
        statusFiltered: 'Showing {{start}} to {{end}} of {{totalFiltered}} filtered rows ({{total}} total)',
        statusNoMatch: 'Filter does not match any items ({{total}} total)',
        pageSize: 'Page Size',
        autoRefresh: 'Auto Refresh',
        showInactive: 'Show Inactive',
        noData: 'No Data',
        search: 'Search',
        reload: 'Reload'
      }
    }
  }
}

export class IsGridModelCell {
  Name: string;
  Width: number;
  Position: number;
  Row: number;
  ColumnName: string;
  IsTitle: boolean;
  $isEmpty: boolean;
  $clazz: string = '';
  ProcessValue: boolean;

  static deserialize(input: any): IsGridModelCell {
    let u: IsGridModelCell = new IsGridModelCell();
    Object.assign(u, input);
    u.$clazz = 'col-xs-' + u.Width;
    u.$isEmpty = u.Name === 'EMPTY';
    return u;
  }
}

export class IsGridDataRow {
  ID: any;
  $checked: boolean;
  $clazz: string;
  $searchIndex: string = '';
  COLOR: string;
  $isActive: boolean = true;
  ORDER: number;

  static deserialize(row: any): IsGridDataRow {
    const r: IsGridDataRow = Object.assign(new IsGridDataRow(), row);
    if (row['COLOR']) {
      const rowClass = row['COLOR'].toLowerCase();
      r.$isActive = rowClass !== 'disabled';
      r.$clazz = rowClass === 'default' ? 'default-cls' : rowClass + '-cls';
    } else {
      r.$clazz = 'default';
    }

    // create fulltext filter index
    Object.keys(row)
      .forEach((key: string) => {
        if (key.startsWith('COL1')) {
          const val = row[key];
          if (val) {
            r.$searchIndex += String(val).toLowerCase() + '|';
          }
        }
      });
    return r;
  }

  accepts(filter: string): boolean {
    return this.$searchIndex.indexOf(filter.toLowerCase()) > -1;
  }
}

export class IsGridModel {

  cells: IsGridModelCell[];
  firstRow: IsGridModelCell[] = [];
  rows: IsGridModelCell[] = [];

  static deserialize(inputCells: any[]): IsGridModel {
    const gm: IsGridModel = new IsGridModel();
    gm.cells = inputCells.map((c: any) => IsGridModelCell.deserialize(c));
    gm.cells.forEach((c: IsGridModelCell) => {
      if (c.Row === 1) {
        gm.firstRow.push(c);
      } else {
        gm.rows.push(c);
      }
    });
    return gm;
  }
}
 export class IsGridData {
   GridModel: IsGridModel;
   DataTable: IsGridDataRow[];

   static deserialize(json: any): IsGridData {
     const data: IsGridData = new IsGridData();
     if (!json.GridModel || !Array.isArray(json.DataTable)) {
       throw new Error('Unable to deserialize IsGridData. GridModel object and DataTable array are not set');
     }
     data.GridModel = IsGridModel.deserialize(json.GridModel);
     data.DataTable = json.DataTable.map(i => IsGridDataRow.deserialize(i));
     return data;
   }
 }
