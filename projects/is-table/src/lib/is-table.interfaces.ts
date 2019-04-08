export interface IsTableTranslationsConfig {
  status: string;
  statusFiltered: string;
  statusNoMatch: string;
  pageSize: string;
  noData: string;
  search: string;
  activate: string;
  deactivate: string;
}

export interface IIsTableConfig {
  canSelectRow?: boolean;
  searchItems: Array<string>;
  translations: IsTableTranslationsConfig;
}

export class IsTableConfig {
  static default(): IIsTableConfig {
    return {
      searchItems: [],
      translations: {
        status: 'Showing {{start}} to {{end}} of {{total}} records',
        statusFiltered: 'Showing {{start}} to {{end}} of {{totalFiltered}} filtered rows ({{total}} total)',
        statusNoMatch: 'Filter does not match any items ({{total}} total)',
        pageSize: 'Page Size',
        noData: 'No Data',
        search: 'Search',
        activate: 'Activate',
        deactivate: 'Deactivate'
      }
    }
  }
}

export class IsTableRow {
  ID: any;
  CanDisable: boolean = true;
  IsActive: boolean = true;
  $clazz: string = '';

  Data: Map<string, any>;

  static deserialize(input: any): IsTableRow {
    const r: IsTableRow = Object.assign(new IsTableRow(), input);
    r.$clazz = input.IsActive ? 'default-cls' : 'disabled-cls';

    return r;
  }
}

export class IsTableColumn {
  id: string;
  name: string;
  width: string;
  align: string = "left";
  translate: boolean = true;
}
