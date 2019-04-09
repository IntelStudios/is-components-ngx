import { IsSelectModelConfig } from './is-select.interfaces';

export class SelectItem {
  public ID: string;
  public Value: string;
  public children: Array<SelectItem>;
  public parent: SelectItem;
  source: any = {};
  public disabled: boolean = false;

  public constructor(source: any, modelConfig?: IsSelectModelConfig) {
    if (typeof source === 'string') {
      this.ID = this.Value = source;
    }
    if (typeof source === 'number') {
      this.ID = this.Value = String(source);
    }
    if (typeof source === 'object') {
      this.source = source;
      if (modelConfig) {
        this.ID = String(source[modelConfig.idProp]);
        this.Value = source[modelConfig.textProp];
      } else {
        this.ID = String(source.ID);
        this.Value = source.Value;
      }

      if(source.Disabled) {
        this.disabled = source.Disabled;
      } else {
        this.disabled = false;
      }
      if (source.children && source.Value) {
        this.children = source.children.map((c: any) => {
          let r: SelectItem = new SelectItem(c, modelConfig);
          r.parent = this;
          return r;
        });
        this.Value = source.Value;
      }
    }
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
