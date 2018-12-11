export class SelectItem {
  public ID:string;
  public Value:string;
  public children:Array<SelectItem>;
  public parent:SelectItem;
  source: any = {};

  public constructor(source:any) {
    if (typeof source === 'string') {
      this.ID = this.Value = source;
    }
    if (typeof source === 'number') {
      this.ID = this.Value = String(source);
    }
    if (typeof source === 'object') {
      this.source = source;
      this.ID = String(source.ID);
      this.Value = source.Value;
      if (source.children && source.Value) {
        this.children = source.children.map((c:any) => {
          let r:SelectItem = new SelectItem(c);
          r.parent = this;
          return r;
        });
        this.Value = source.Value;
      }
    }
  }

  public fillChildrenHash(optionsMap:Map<string, number>, startIndex:number):number {
    let i = startIndex;
    this.children.map((child:SelectItem) => {
      optionsMap.set(child.ID, i++);
    });
    return i;
  }

  public hasChildren():boolean {
    return this.children && this.children.length > 0;
  }

  public getSimilar():SelectItem {
    let r:SelectItem = new SelectItem(false);
    r.ID = this.ID;
    r.Value = this.Value;
    r.parent = this.parent;
    return r;
  }
}
