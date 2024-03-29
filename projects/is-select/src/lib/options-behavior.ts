import { IsSelectOptionsComponent } from './is-select-options/is-select-options.component';
import { SelectItem } from './select-item';

export interface IOptionsBehavior {
  init(): void;
  reset(): any;
  first(): any;
  last(): any;
  prev(count?: number): any;
  next(count?: number): any;
  filter(query: RegExp): any;
  ensureHighlightVisible();
}

export class OptionsBehavior {
  optionsMap: Map<string, number> = new Map<string, number>();

  protected select: IsSelectOptionsComponent;

  constructor(actor: IsSelectOptionsComponent) {
    this.select = actor;
  }

  fillOptionsMap(): void {
    this.optionsMap.clear();
    let startPos = 0;
    this.select.options
      .map((item: SelectItem) => {
        startPos = item.fillChildrenHash(this.optionsMap, startPos);
      });
  }

  init(): void {
    this.reset();
    if (this.select.value) {
      if (this.select.multiple) {
        const values = this.select.value as SelectItem[];
        if (values?.length > 0) {
          this.select.setActiveOption(values[0]);
        }
      } else {
        this.select.setActiveOption(this.select.value as SelectItem);
      }
    }
  }

  reset() {
    this.select.visibleOptions = this.select.options;
    this.ensureHighlightVisible();
  }

  static filterPredicate(options: SelectItem[], predicate: (option: SelectItem) => boolean): SelectItem[] {
    const ret = [];

    options.forEach(opt => {
      let condition = false;
      // XI2543 - extension of search capability also for nodes
      if (predicate(opt)) {
        ret.push(opt);
        condition = true;
      }

      if (!condition) {
        if (opt.hasChildren()) {
          const children = OptionsBehavior.filterPredicate(opt.children, predicate);
          if (children.length > 0) {
            const opt2 = opt.getSimilar();
            opt2.children = children;
            ret.push(opt2);
          }
        }
      }
    })

    return ret;
  }

  static getLeafOptions(options: SelectItem[], result?: SelectItem[]): SelectItem[] {
    const ret = result || [];
    options.forEach(opt => {
      if (opt.hasChildren()) {
        OptionsBehavior.getLeafOptions(opt.children, ret);
      } else {
        ret.push(opt);
      }
    })
    return ret;
  }

  ensureHighlightVisible(optionsMap: Map<string, number> = void (0)): void {
    const container = this.select.element.nativeElement.querySelector('.ui-select-choices');
    if (!container) {
      return;
    }
    const choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      return;
    }
    const activeIndex = this.getActiveIndex(optionsMap);
    if (activeIndex < 0) {
      return;
    }
    const highlighted = choices[activeIndex] as HTMLDivElement;
    if (!highlighted) {
      return;
    }
    highlighted.scrollIntoView();
  }

  private getActiveIndex(optionsMap: Map<string, number> = void 0): number {
    // let parentID = this.actor.activeOption.parent.ID;
    // let selectedItem = this.actor.options.find((parent: SelectItem) => parent.ID === parentID);

    // let ai = this.actor.options.find(item => item === selectedItem).children.indexOf(this.actor.activeOption)//.indexOf(this.actor.activeOption);
    // if (ai < 0 && optionsMap !== void(0)) {
    //   ai = optionsMap.get(this.actor.activeOption.ID);
    // }
    // return ai;
    let ai = this.select.visibleOptions.indexOf(this.select.activeOption);
    if (ai < 0 && optionsMap !== void (0)) {
      ai = optionsMap.get(this.select.activeOption.ID);
    }
    return ai;
  }
}

export class GenericOptionsBehavior extends OptionsBehavior implements IOptionsBehavior {
  constructor(actor: IsSelectOptionsComponent) {
    super(actor);
  }

  first(): void {
    this.select.setActiveOption(this.select.visibleOptions[0]);
    super.ensureHighlightVisible();
  }

  last(): void {
    this.select.setActiveOption(this.select.visibleOptions[this.select.visibleOptions.length - 1]);
    super.ensureHighlightVisible();
  }

  prev(count = 1): void {
    const notFoundIndex = count === 1 ? this.select.visibleOptions.length - 1 : 0;
    const index = this.select.visibleOptions.findIndex((o) => o.ID === this.select.activeOption?.ID);
    this.select.setActiveOption(this.select.visibleOptions[index - count < 0 ? notFoundIndex : index - count]);
    super.ensureHighlightVisible();
  }

  next(count = 1): void {
    const notFoundIndex = count === 1 ? 0 : this.select.visibleOptions.length - 1;
    const index = this.select.visibleOptions.findIndex((o) => o.ID === this.select.activeOption?.ID);
    this.select.setActiveOption(this.select.visibleOptions[index + count > this.select.visibleOptions.length - 1 ? notFoundIndex : index + count]);
    super.ensureHighlightVisible();
  }

  filter(query: RegExp): void {
    const options = OptionsBehavior.filterPredicate(this.select.options, (option: SelectItem) => !!option.FilterValue.match(query));
    this.select.visibleOptions = options;
    if (this.select.visibleOptions.length > 0) {
      this.select.setActiveOption(this.select.visibleOptions[0]);
      super.ensureHighlightVisible();
    }
  }
}

export class ChildrenOptionsBehavior extends OptionsBehavior implements IOptionsBehavior {
  constructor(actor: IsSelectOptionsComponent) {
    super(actor);
  }

  first(): void {
    this.select.setActiveOption(undefined);
    // TODO implement
    // let parentIndex = 0;
    // let childIndex = 0;

    // // if first child is disabled find other one which is not disabled
    // for (let i = 0; i < this.select.visibleOptions.length; i++) {
    //   let child = this.select.visibleOptions[parentIndex].children[childIndex];
    //   if (child) {
    //     if (child.disabled === true) {
    //       childIndex++;
    //     } else {
    //       this.select.setActiveOption(this.select.visibleOptions[parentIndex].children[childIndex]);
    //       break;
    //     }
    //   } else {
    //     parentIndex++;
    //     childIndex = 0;
    //     this.select.setActiveOption(undefined);
    //   }
    // }

    // this.fillOptionsMap();
    // this.ensureHighlightVisible(this.optionsMap);
  }

  last(): void {
    // TODO implement
    // let parentIndex = 1;
    // let childIndex = 1;

    // // if first child is disabled find other one which is not disabled
    // for (let i = 0; i < this.select.visibleOptions.length; i++) {
    //   let child = this.select.visibleOptions[this.select.visibleOptions.length - parentIndex].children[this.select.visibleOptions[this.select.visibleOptions.length - parentIndex].children.length - childIndex];
    //   if (child) {
    //     if (child.disabled === true) {
    //       childIndex++;
    //     } else {
    //       this.select.setActiveOption(this.select.visibleOptions[this.select.visibleOptions.length - parentIndex].children[this.select.visibleOptions[this.select.visibleOptions.length - parentIndex].children.length - childIndex]);
    //       break;
    //     }
    //   } else {
    //     parentIndex++;
    //     childIndex = 1;
    //     this.select.setActiveOption(undefined);
    //   }
    // }

    // //this.actor.activeOption = this.actor.options[this.actor.options.length - 1].children[this.actor.options[this.actor.options.length - 1].children.length - 1];
    // this.fillOptionsMap();
    // this.ensureHighlightVisible(this.optionsMap);
  }

  prev(): void {
    // TODO implement
    // if (!this.select.activeOption) {
    //   return;
    // }
    // const indexParent = this.select.visibleOptions
    //   .findIndex((option: SelectItem) => this.select.activeOption.parent && this.select.activeOption.parent.ID === option.ID);
    // const index = this.select.visibleOptions[indexParent].children
    //   .findIndex((option: SelectItem) => this.select.activeOption && this.select.activeOption.ID === option.ID);
    // this.select.setActiveOption(this.select.visibleOptions[indexParent].children[index - 1]);

    // // if one or more child/children is/are disabled, skip them
    // if (this.select.activeOption && this.select.activeOption.disabled === true) {
    //   let tempIndex = 1;
    //   for (let i = 0; i < this.select.visibleOptions.length; i++) {
    //     if (this.select.visibleOptions[indexParent].children[index - tempIndex] && this.select.visibleOptions[indexParent].children[index - tempIndex].disabled === true) {
    //       tempIndex++;
    //     } else {
    //       this.select.setActiveOption(this.select.visibleOptions[indexParent].children[index - tempIndex]);
    //       break;
    //     }
    //   }
    // }

    // if (!this.select.activeOption) {
    //   if (this.select.visibleOptions[indexParent - 1]) {
    //     this.select.setActiveOption(this.select
    //       .visibleOptions[indexParent - 1]
    //       .children[this.select.visibleOptions[indexParent - 1].children.length - 1]);
    //   }
    // }
    // if (!this.select.activeOption) {
    //   this.last();
    // }
    // this.fillOptionsMap();
    // this.ensureHighlightVisible(this.optionsMap);
  }

  next(): void {
    // TODO implement
    // if (!this.select.activeOption) {
    //   return;
    // }
    // const indexParent = this.select.visibleOptions
    //   .findIndex((option: SelectItem) => this.select.activeOption.parent && this.select.activeOption.parent.ID === option.ID);
    // const index = this.select.visibleOptions[indexParent].children
    //   .findIndex((option: SelectItem) => this.select.activeOption && this.select.activeOption.ID === option.ID);
    // this.select.setActiveOption(this.select.visibleOptions[indexParent].children[index + 1]);

    // // if one or more child/children is/are disabled, skip them
    // if (this.select.activeOption && this.select.activeOption.disabled === true) {
    //   let tempIndex = 1;
    //   for (let i = 0; i < this.select.visibleOptions.length; i++) {
    //     if (this.select.visibleOptions[indexParent].children[index + tempIndex] && this.select.visibleOptions[indexParent].children[index + tempIndex].disabled === true) {
    //       tempIndex++;
    //     } else {
    //       this.select.setActiveOption(this.select.visibleOptions[indexParent].children[index + tempIndex]);
    //       break;
    //     }
    //   }
    // }

    // if (!this.select.activeOption) {
    //   if (this.select.visibleOptions[indexParent + 1]) {
    //     this.select.setActiveOption(this.select.visibleOptions[indexParent + 1].children[0]);
    //   }
    // }
    // if (!this.select.activeOption) {
    //   this.first();
    // }
    // this.fillOptionsMap();
    // this.ensureHighlightVisible(this.optionsMap);
  }

  filter(query: RegExp): void {
    this.select.visibleOptions = OptionsBehavior.filterPredicate(this.select.options, (opt) => !!opt.FilterValue.match(query));
    if (this.select.visibleOptions.length > 0) {
      // find leat (active option) which isn't disabled
      const option = this.findLeaf(this.select.visibleOptions);

      if (option) {
        this.select.setActiveOption(option);
        super.ensureHighlightVisible(this.optionsMap);
      } else {
        this.select.setActiveOption(undefined);
      }
    }
  }

  reset() {
    this.select.visibleOptions = this.select.options;
    super.ensureHighlightVisible();
  }

  /**
   * Find first item which hasn't got child/ren and it is not disabled
   */
  private findLeaf(options: SelectItem[]): SelectItem | null {
    let found = null;

    for (let i = 0; i < options.length; i++) {
      const opt = options[i];

      if (opt.hasChildren()) {
        return this.findLeaf(opt.children);
      } else {
        found = opt.disabled ? null : opt;
      }
      if (found) {
        return found;
      }
    }

    return found;
  }
}
