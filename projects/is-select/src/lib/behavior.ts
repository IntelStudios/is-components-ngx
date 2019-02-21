import { IsSelectComponent } from './is-select.component';
import { SelectItem } from './select-item';
import { stripTags } from './select-pipes';

export interface OptionsBehavior {
  first(): any;
  last(): any;
  prev(): any;
  next(): any;
  filter(query: RegExp): any;
}

export class Behavior {
  public optionsMap: Map<string, number> = new Map<string, number>();

  public actor: IsSelectComponent;

  public constructor(actor: IsSelectComponent) {
    this.actor = actor;
  }

  public fillOptionsMap(): void {
    this.optionsMap.clear();
    let startPos = 0;
    this.actor.itemObjects
      .map((item: SelectItem) => {
        startPos = item.fillChildrenHash(this.optionsMap, startPos);
      });
  }

  public ensureHighlightVisible(optionsMap: Map<string, number> = void(0)): void {
    let container = this.actor.element.nativeElement.querySelector('.ui-select-choices');
    if (!container) {
      return;
    }
    let choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      return;
    }
    let activeIndex = this.getActiveIndex(optionsMap);
    if (activeIndex < 0) {
      return;
    }
    let highlighted: any = choices[activeIndex];
    if (!highlighted) {
      return;
    }

    let posY: number = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
    let height: number = container.offsetHeight;

    let searchInputHeight = 0;

    const searchInput = this.actor.element.nativeElement.querySelector('.ui-select-search');
    if (searchInput) {
      searchInputHeight = searchInput.clientHeight;
    }
    if (posY > height) {
      container.scrollTop += posY - height - searchInputHeight;
    } else if (posY < highlighted.clientHeight) {
      container.scrollTop -= highlighted.clientHeight - posY + searchInputHeight;
    }
  }

  private getActiveIndex(optionsMap: Map<string, number> = void 0): number {
    // let parentID = this.actor.activeOption.parent.ID;
    // let selectedItem = this.actor.options.find((parent: SelectItem) => parent.ID === parentID);

    // let ai = this.actor.options.find(item => item === selectedItem).children.indexOf(this.actor.activeOption)//.indexOf(this.actor.activeOption);
    // if (ai < 0 && optionsMap !== void(0)) {
    //   ai = optionsMap.get(this.actor.activeOption.ID);
    // }
    // return ai;
    let ai = this.actor.options.indexOf(this.actor.activeOption);
    if (ai < 0 && optionsMap !== void(0)) {
      ai = optionsMap.get(this.actor.activeOption.ID);
    }
    return ai;
  }
}

export class GenericBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor: IsSelectComponent) {
    super(actor);
  }

  public first(): void {
    this.actor.activeOption = this.actor.options[0];
    super.ensureHighlightVisible();
  }

  public last(): void {
    this.actor.activeOption = this.actor.options[this.actor.options.length - 1];
    super.ensureHighlightVisible();
  }

  public prev(): void {
    let index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor.options[index - 1 < 0 ? this.actor.options.length - 1 : index - 1];
    super.ensureHighlightVisible();
  }

  public next(): void {
    let index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor.options[index + 1 > this.actor.options.length - 1 ? 0 : index + 1];
    super.ensureHighlightVisible();
  }

  public filter(query: RegExp): void {
    let options = this.actor.itemObjects
      .filter((option: SelectItem) => {
        return stripTags(option.Value).match(query);
      });
    this.actor.options = options;
    if (this.actor.options.length > 0) {
      this.actor.activeOption = this.actor.options[0];
      super.ensureHighlightVisible();
    }
  }
}

export class ChildrenBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor: IsSelectComponent) {
    super(actor);
  }

  public first(): void {
    let parentIndex = 0;
    let childIndex = 0;

    // if first child is disabled find other one which is not disabled
    for (let i = 0; i < this.actor.options.length; i++) {
      let child = this.actor.options[parentIndex].children[childIndex];
      if (child) {
        if (child.disabled === true) {
          childIndex++;
        } else {
          this.actor.activeOption = this.actor.options[parentIndex].children[childIndex];
          break;
        }
      } else {
        parentIndex++;
        childIndex = 0;
        this.actor.activeOption = null;
      }
    }

    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public last(): void {
    let parentIndex = 1;
    let childIndex = 1;

    // if first child is disabled find other one which is not disabled
    for (let i = 0; i < this.actor.options.length; i++) {
      let child = this.actor.options[this.actor.options.length - parentIndex].children[this.actor.options[this.actor.options.length - parentIndex].children.length - childIndex];
      if (child) {
        if (child.disabled === true) {
          childIndex++;
        } else {
          this.actor.activeOption = this.actor.options[this.actor.options.length - parentIndex].children[this.actor.options[this.actor.options.length - parentIndex].children.length - childIndex];
          break;
        }
      } else {
        parentIndex++;
        childIndex = 1;
        this.actor.activeOption = null;
      }
    }

    //this.actor.activeOption = this.actor.options[this.actor.options.length - 1].children[this.actor.options[this.actor.options.length - 1].children.length - 1];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public prev(): void {
    let indexParent = this.actor.options
      .findIndex((option: SelectItem) => this.actor.activeOption.parent && this.actor.activeOption.parent.ID === option.ID);
    let index = this.actor.options[indexParent].children
      .findIndex((option: SelectItem) => this.actor.activeOption && this.actor.activeOption.ID === option.ID);
    this.actor.activeOption = this.actor.options[indexParent].children[index - 1];

    // if one or more child/children is/are disabled, skip them
    if (this.actor.activeOption && this.actor.activeOption.disabled === true) {
      let tempIndex = 1;
      for (let i = 0; i < this.actor.options.length; i++) {
        if (this.actor.options[indexParent].children[index - tempIndex] && this.actor.options[indexParent].children[index - tempIndex].disabled === true) {
          tempIndex++;
        } else {
          this.actor.activeOption = this.actor.options[indexParent].children[index - tempIndex];
          break;
        }
      }
    }

    if (!this.actor.activeOption) {
      if (this.actor.options[indexParent - 1]) {
        this.actor.activeOption = this.actor
          .options[indexParent - 1]
          .children[this.actor.options[indexParent - 1].children.length - 1];
      }
    }
    if (!this.actor.activeOption) {
      this.last();
    }
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public next(): void {
    let indexParent = this.actor.options
      .findIndex((option: SelectItem) => this.actor.activeOption.parent && this.actor.activeOption.parent.ID === option.ID);
    let index = this.actor.options[indexParent].children
      .findIndex((option: SelectItem) => this.actor.activeOption && this.actor.activeOption.ID === option.ID);
    this.actor.activeOption = this.actor.options[indexParent].children[index + 1];

    // if one or more child/children is/are disabled, skip them
    if (this.actor.activeOption && this.actor.activeOption.disabled === true) {
      let tempIndex = 1;
      for (let i = 0; i < this.actor.options.length; i++) {
        if (this.actor.options[indexParent].children[index + tempIndex] && this.actor.options[indexParent].children[index + tempIndex].disabled === true) {
          tempIndex++;
        } else {
          this.actor.activeOption = this.actor.options[indexParent].children[index + tempIndex];
          break;
        }
      }
    }

    if (!this.actor.activeOption) {
      if (this.actor.options[indexParent + 1]) {
        this.actor.activeOption = this.actor.options[indexParent + 1].children[0];
      }
    }
    if (!this.actor.activeOption) {
      this.first();
    }
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public filter(query: RegExp): void {
    let options: Array<SelectItem> = [];
    let optionsMap: Map<string, number> = new Map<string, number>();
    let startPos = 0;
    for (let si of this.actor.itemObjects) {
      let children: Array<SelectItem> = si.children.filter((option: SelectItem) => query.test(option.Value));
      startPos = si.fillChildrenHash(optionsMap, startPos);
      if (children.length > 0) {
        let newSi = si.getSimilar();
        newSi.children = children;
        options.push(newSi);
      }
    }
    this.actor.options = options;
    if (this.actor.options.length > 0) {
      this.actor.activeOption = this.actor.options[0].children[0];
      super.ensureHighlightVisible(optionsMap);
    }
  }
}
