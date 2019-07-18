import { EventEmitter } from '@angular/core';

import { IISTreeNode } from './is-dx-select-tree.interfaces';

export class IsDXSelectTreeNode {

  id: number;
  EntityID: number;
  name: string;
  children: IsDXSelectTreeNode[] = [];
  parent: IsDXSelectTreeNode = null;
  icon: string;
  $classes: { [fieldName: string]: string; } = {};
  $isSaving: boolean = false;
  $matchesFilter: boolean = true;
  isPropagateValue: boolean;
  isExpanded: boolean = true;
  badgeHtml: string = '';
  onUpdateView: EventEmitter<any> = new EventEmitter<any>();
  canSelect: boolean;
  path: string;
  $checked: boolean;

  private Values: { [fieldName: string]: boolean; } = {};

  constructor(id: number, name: string, canSelect: boolean = true, path: string, checked: boolean = false) {
    this.id = id || this.uuid();
    this.name = name;
    this.canSelect = canSelect;
    this.path = path;
    this.$checked = checked;
    this.isPropagateValue = false; //this.isVirtual();
  }

  static createRoot(): IsDXSelectTreeNode {
    return new IsDXSelectTreeNode(0, 'All', false, '').withIcon('fa fa-star-o');
  }

  static deserialize(root: IISTreeNode, defaultIcon: string = null, ...fields: IsDXSelectField[]): IsDXSelectTreeNode {
    const node: IsDXSelectTreeNode = new IsDXSelectTreeNode(root.ID, root.Name, root.CanSelect, root.Path, root.$checked)
      .withIcon(root.Icon ? root.Icon : defaultIcon);
    if (!node.isVirtual() && node.canSelect) {
      const values = root.Values || {};
      fields.forEach((f: IsDXSelectField) => {
        const val = values[f.fieldName];
        node.setValue(f, val === true ? val : false);
      });
    }

    if (root.Children && root.Children.length > 0) {
      node.children = root.Children.map(c => IsDXSelectTreeNode.deserialize(c, defaultIcon, ...fields));
    }
    return node;
  }

  isVirtual(): boolean {
    return this.id < 0;
  }

  setValue(f: IsDXSelectField, value: boolean) {
    this.Values[f.fieldName] = value;
    this.$classes[f.fieldName] = value === true ? 'fa fa-fw ' + f.iconOn : 'fa fa-fw ' + f.iconOff;
  }

  getValue(f: IsDXSelectField): boolean {
    return this.Values[f.fieldName];
  }

  getFirstNonVirtualValue(f: IsDXSelectField): boolean {
    let value: boolean = null;
    if (this.children.length === 0) {
      return false;
    }
    this.eachNode((child: IsDXSelectTreeNode) => {
      if (!child.isVirtual() && value === null) {
        value = child.getValue(f);
      }
    })
    return value;
  }

  /**
   * cleans up virual leaf nodes (such nodes do not have any data anyway).
   * This is done stupid way => we iterrate the tree several times
   */
  removeVirtualLeaves(iterationCount: number = 2) {
    // by default we run 2 + 1 iterations of this (max "known" tree depth is 4)
    //console.time('removeVirtualLeaves');
    for (let i = iterationCount; i > 0; i--) {
      this._removeVirtualLeaves();
    }
    // last iteration runs always - direct children of this node
    const toRemove = this.children.filter((c: IsDXSelectTreeNode) => {
      if (c.isVirtual() && c.children.length === 0) {
        return c;
      }
    });
    toRemove.forEach((child: IsDXSelectTreeNode) => {
      this.children.splice(this.children.indexOf(child), 1);
    });
    //console.timeEnd('removeVirtualLeaves');
  }

  _removeVirtualLeaves() {
    this.eachNode((node: IsDXSelectTreeNode) => {
      const toRemove = node.children.filter((c: IsDXSelectTreeNode) => {
        if (c.isVirtual() && c.children.length === 0) {
          return c;
        }
      });
      toRemove.forEach((child: IsDXSelectTreeNode) => {
        node.children.splice(node.children.indexOf(child), 1);
      });
    });
  }


  withPropagateValue(enablePropagation: boolean): IsDXSelectTreeNode {
    this.isPropagateValue = enablePropagation;
    return this;
  }

  withIcon(icon: string): IsDXSelectTreeNode {
    this.icon = icon;
    return this;
  }

  withEntityID(EntityID: number) {
    this.EntityID = EntityID;
    return this;
  }

  public uuid(): number {
    return - Math.floor(Math.random() * 10000000000000);
  }

  eachNode(callback: (node: IsDXSelectTreeNode, level: number) => any) {
    let level = 1;
    this.children.forEach((child: IsDXSelectTreeNode) => this.forEachNode(child, callback, level));
  }

  protected forEachNode(node: IsDXSelectTreeNode, callback: (node: IsDXSelectTreeNode, level: number) => any, level: number) {
    callback(node, level);
    let l = level + 1;
    node.children.forEach((child: IsDXSelectTreeNode) => this.forEachNode(child, callback, l));
  }

  protected forEachParentNode(node: IsDXSelectTreeNode, callback: (parent: IsDXSelectTreeNode, node: IsDXSelectTreeNode) => any) {
    node.children.forEach((child: IsDXSelectTreeNode) => {
      callback(node, child);
      this.forEachParentNode(child, callback);
    });
  }
}

export class IsDXSelectTreeChangeEvent {

  changes: { [id: number]: { [fieldName: string]: boolean } } = {};
  constructor(public saveFinished: () => void) {
  }

  /**
   * applies current changes to previous changes. Both events *MUST* have
   * same fields and this works only for single fieldsets
   * {IsSelectTreeChangeEvent} event [description]
   */
  applyTo(event: IsDXSelectTreeChangeEvent): IsDXSelectTreeChangeEvent {
    if (!event) {
      event = new IsDXSelectTreeChangeEvent(() => { return; });
    }
    const ret: IsDXSelectTreeChangeEvent = new IsDXSelectTreeChangeEvent(this.saveFinished);
    ret.changes = event.changes;
    Object.keys(this.changes)
      .forEach((id: string) => {
        ret.changes[id] = this.changes[id];
      });

    return ret;
  }

  getSelectedIDs(field: string): number[] {
    const ret: number[] = [];
    Object.keys(this.changes)
      .forEach((key: string) => {
        if (this.changes[key][field] === true) {
          ret.push(Number(key));
        }
      });
    return ret;
  }
}

export class IsDXSelectTree extends IsDXSelectTreeNode {

  changed: EventEmitter<IsDXSelectTreeChangeEvent> = new EventEmitter<IsDXSelectTreeChangeEvent>();
  indicateSaving: boolean = true;
  selectionFields: IsDXSelectField[] = [IsDXSelectField.selected()];

  constructor() {
    super(null, 'root', false, '');
    this.icon = '';
  }

  updateView() {
    this.eachNode((n: IsDXSelectTreeNode, level: number) => {
      n.onUpdateView.emit(null);
    });
  }

  setNodeValue(nodeId: number, field: IsDXSelectField, value: boolean) {
    this.eachNode((n: IsDXSelectTreeNode, level: number) => {
      if (n.id === nodeId) {
        n.setValue(field, value);
        this.updateParentClasses(n, field);
      }
    });
    const e = new IsDXSelectTreeChangeEvent(() => {
      this.updateView();
    });
    e.changes[nodeId] = {};
    e.changes[nodeId][field.fieldName] = value;
    this.changed.emit(e);
  }

  /**
   * update parent's classes of this node
   * {IsSelectTreeNode} node [description]
   * {IsSelectField}       f    [description]
   */
  updateParentClasses(node: IsDXSelectTreeNode, f: IsDXSelectField) {
    let parent: IsDXSelectTreeNode = node.parent;
    while (parent) {
      this.computeNodeClass(parent, f);
      parent = parent.parent;
    }
  }

  /**
   * initializes tree, this method has to be called
   * once tree node's are set to correctly populate
   * IsSelectTreeNode.$classes
   */
  initialize() {
    // set parent references
    let lastLevelParents: IsDXSelectTreeNode[] = [];
    this.children.forEach((root: IsDXSelectTreeNode) => {

      this.forEachParentNode(root, (parentNode: IsDXSelectTreeNode, child: IsDXSelectTreeNode) => {
        child.parent = parentNode;
        let isLastLevelParent: boolean = child.children.length > 0;
        child.children.forEach((grandChild: IsDXSelectTreeNode) => {
          isLastLevelParent = isLastLevelParent && grandChild.children.length === 0;
        });
        if (isLastLevelParent) {
          lastLevelParents.push(child);
        }
      });

    });
    if (lastLevelParents.length === 0) {
      // tree seems to be only 1 level deep
      lastLevelParents = this.children;
    }

    while (lastLevelParents.length > 0) {
      let newParents: IsDXSelectTreeNode[] = [];
      lastLevelParents.forEach((node: IsDXSelectTreeNode) => {
        if (node.parent) {
          newParents.push(node.parent);
        }
        this.selectionFields.forEach((f: IsDXSelectField) => {
          this.computeNodeClass(node, f);
        });
      });
      lastLevelParents = newParents;
    }
  }

  private computeNodeClass(node: IsDXSelectTreeNode, f: IsDXSelectField) {
    if (node.isVirtual()) {
      node.$classes[f.fieldName] = this.getNodeClassHelper(node, f);
    }
  }

  private getNodeClassHelper(node: IsDXSelectTreeNode, f: IsDXSelectField): string {
    const helper: any = {};
    node.children.forEach((child: IsDXSelectTreeNode) => {
      let clazz = child.$classes[f.fieldName];
      if (clazz) {
        helper[clazz] = '';
      }
      if (!child.isVirtual() && child.children.length > 0) {
        clazz = this.getNodeClassHelper(child, f);
        if (clazz) {
          helper[clazz] = '';
        }
      }
    });
    const diff: number = Object.keys(helper).length;
    if (diff === 1) {
      // we found only same classes - no change => inherit class
      return Object.keys(helper)[0];
    } else if (diff > 1) {
      return `fa fa-fw ${f.iconOn} ${node.isVirtual() ? 'undetermined' : ''}`;
    } else {
      return node.$classes[f.fieldName];
    }
  }

  static deserializeTree(root: IISTreeNode, defaultIcon: string = null, ...fields: IsDXSelectField[]): IsDXSelectTree {
    const t: IsDXSelectTree = new IsDXSelectTree();
    t.selectionFields = fields;
    const rootNode: IsDXSelectTreeNode = IsDXSelectTreeNode.deserialize(root, defaultIcon, ...fields);
    t.children.push(rootNode);
    t.initialize();
    return t;
  }

}

export class IsDXSelectField {
  name: string;
  fieldName: string;
  iconOn: string;
  iconOff: string;
  dependentFieldName: string;

  static selected(): IsDXSelectField {
    let sf: IsDXSelectField = new IsDXSelectField();
    sf.name = 'shared.select-tree.selected';
    sf.iconOn = 'fa-check-square-o';
    sf.iconOff = 'fa-square-o';
    sf.fieldName = 'IsSelected';
    return sf;
  }

  static applicable(): IsDXSelectField {
    let sf: IsDXSelectField = new IsDXSelectField();
    sf.name = 'shared.select-tree.selected';
    sf.iconOn = 'fa-check-square-o';
    sf.iconOff = 'fa-square-o';
    sf.fieldName = 'IsApplicable';
    return sf;
  }

  static allowed(): IsDXSelectField {
    let sf: IsDXSelectField = new IsDXSelectField();
    sf.name = 'shared.select-tree.allowed';
    sf.iconOn = 'fa-check-square-o';
    sf.iconOff = 'fa-square-o';
    sf.fieldName = 'IsAllowed';
    return sf;
  }

  static editable(): IsDXSelectField {
    let sf: IsDXSelectField = new IsDXSelectField();
    sf.name = 'shared.select-tree.editable';
    sf.iconOn = 'fa-pencil-square-o';
    sf.iconOff = 'fa-square-o';
    sf.fieldName = 'IsEditable';
    return sf;
  }

  static visible(): IsDXSelectField {
    let sf: IsDXSelectField = new IsDXSelectField();
    sf.name = 'shared.select-tree.visible';
    sf.iconOn = 'fa-eye';
    sf.iconOff = 'fa-eye-slash';
    sf.fieldName = 'IsVisible';
    return sf;
  }

  static visibleEditable(): IsDXSelectField[] {
    return [IsDXSelectField.visible(), IsDXSelectField.editable().withDependentField('IsVisible')];
  }

  withDependentField(field: string): IsDXSelectField {
    this.dependentFieldName = field;
    return this;
  }
}
