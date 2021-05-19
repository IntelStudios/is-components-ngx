import { IsSelectModelConfig } from './is-select.interfaces';
import { stripTags } from './select-pipes';
import { stripDiacritics } from 'is-text-utils';

export class SelectItem {
  ID: string;
  Value: string;
  children: Array<SelectItem>;
  parent: SelectItem;
  source: any = {};
  disabled: boolean = false;
  FilterValue: string = '';
  cssClass: string;
  Checked: boolean = false;

  public constructor(source: any, modelConfig?: IsSelectModelConfig) {
    if (typeof source === 'string') {
      this.ID = this.Value = source;
    }
    if (typeof source === 'number') {
      this.ID = this.Value = String(source);
    }
    if (typeof source === 'object') {
      this.source = source;
      this.cssClass = source.cssClass;
      if (modelConfig) {
        this.ID = String(source[modelConfig.idProp]);
        this.Value = source[modelConfig.textProp];
      } else {
        this.ID = String(source.ID);
        this.Value = source.Value;
      }

      if (source.Disabled) {
        this.disabled = source.Disabled;
      } else {
        this.disabled = false;
      }
      if (source.children && source.Value) {
        this.children = source.children.map((c: any) => {
          const r: SelectItem = new SelectItem(c, modelConfig);
          r.parent = this;
          return r;
        });
        this.Value = source.Value;
      }
    }
    if (this.Value) {
      this.FilterValue = stripTags(stripDiacritics(this.Value));
    }
  }

  /**
 * gets current's item ID with attepmt to type it as number if possible
 */
  getID(convert?: boolean): string | number {
    if (!this.source) {
      return this.ID;
    }
    if (!convert) {
      return this.ID;
    }
    const isNum = String((parseInt(this.source.ID))) === String(this.source.ID)
      || String((parseInt(this.source.id))) === String(this.source.id);

    return isNum ? Number(this.ID) : this.ID;
  }

  public fillChildrenHash(optionsMap: Map<string, number>, startIndex: number): number {
    let i = startIndex;
    this.children.map((child: SelectItem) => {
      optionsMap.set(child.ID, i++);
    });
    return i;
  }

  public hasChildren(): boolean {
    return this.children && this.children.length > 0;
  }

  public getSimilar(): SelectItem {
    let r: SelectItem = new SelectItem(false);
    r.ID = this.ID;
    r.Value = this.Value;
    r.parent = this.parent;
    return r;
  }
}
