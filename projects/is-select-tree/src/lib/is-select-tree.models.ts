import { EventEmitter } from '@angular/core';
import { IISTreeNode } from './is-select-tree.interfaces';

export class IsSelectTreeNode {

  id: number | string;
  EntityID: number;
  name: string;
  children: IsSelectTreeNode[] = [];
  parent: IsSelectTreeNode = null;
  icon: string;
  $classes: { [fieldName: string]: string; } = {};
  $isSaving: boolean = false;
  $matchesFilter: boolean = true;
  propagateValue: boolean;
  disableChildren: boolean;
  isExpanded: boolean = true;
  badgeHtml: string = '';
  onUpdateView: EventEmitter<any> = new EventEmitter<any>();

  private Values: { [fieldName: string]: boolean; } = {};
  private Disabled: { [fieldName: string]: boolean; } = {};

  constructor(id: number | string, name: string) {
    this.id = id || this.uuid();
    this.name = name;
    this.propagateValue = this.isVirtual();
  }

  static createRoot(): IsSelectTreeNode {
    return new IsSelectTreeNode(0, 'All').withIcon('fa-regular fa-star');
  }

  static deserialize(root: IISTreeNode, defaultIcon: string = null, ...fields: IsSelectField[]): IsSelectTreeNode {
    const node: IsSelectTreeNode = new IsSelectTreeNode(root.ID, root.Name)
      .withPropagateValue(root.PropagateValue === true)
      .withDisableChildren(root.DisableChildren === true)
      .withIcon(root.Icon ? root.Icon : defaultIcon);

    if (root.Children && root.Children.length > 0) {
      node.children = root.Children.map(c => IsSelectTreeNode.deserialize(c, defaultIcon, ...fields));
    }

    if (!node.isVirtual()) {
      const values = root.Values || {};
      fields.forEach((f: IsSelectField) => {
        const val = values[f.fieldName];
        node.setValue(f, val === true ? val : false);
      });
    }

    return node;
  }

  isVirtual(): boolean {
    return !String(this.id) || Number(this.id) < 0;
  }

  setValue(f: IsSelectField, value: boolean) {
    this.Values[f.fieldName] = value;
    this.$classes[f.fieldName] = value === true ? 'fa fa-fw ' + f.iconOn : 'fa fa-fw ' + f.iconOff;
    if (this.disableChildren) {
      this.children.forEach((c) => {
        c.setDisabled(f, value);
      });
    }
  }

  getDisabled(f: IsSelectField) {
    return this.Disabled[f.fieldName] ?? false;
  }

  setDisabled(f: IsSelectField, value: boolean) {
    this.Disabled[f.fieldName] = value;
    const cls = this.$classes[f.fieldName];
    if (value) {
      this.$classes[f.fieldName] = `${cls} disabled`;
    } else {
      this.$classes[f.fieldName] = cls.replace(' disabled', '');
    }
  }

  getValue(f: IsSelectField): boolean {
    return this.Values[f.fieldName];
  }

  getFirstNonVirtualValue(f: IsSelectField): boolean {
    let value: boolean = null;
    if (this.children.length === 0) {
      return false;
    }
    this.eachNode((child: IsSelectTreeNode) => {
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
    const toRemove = this.children.filter((c: IsSelectTreeNode) => {
      if (c.isVirtual() && c.children.length === 0) {
        return c;
      }
    });
    toRemove.forEach((child: IsSelectTreeNode) => {
      this.children.splice(this.children.indexOf(child), 1);
    });
    //console.timeEnd('removeVirtualLeaves');
  }

  _removeVirtualLeaves() {
    this.eachNode((node: IsSelectTreeNode) => {
      const toRemove = node.children.filter((c: IsSelectTreeNode) => {
        if (c.isVirtual() && c.children.length === 0) {
          return c;
        }
      });
      toRemove.forEach((child: IsSelectTreeNode) => {
        node.children.splice(node.children.indexOf(child), 1);
      });
    });
  }


  withPropagateValue(enablePropagation: boolean): IsSelectTreeNode {
    this.propagateValue = enablePropagation;
    return this;
  }

  withDisableChildren(disable: boolean): IsSelectTreeNode {
    this.disableChildren = disable;
    return this;
  }

  withIcon(icon: string): IsSelectTreeNode {
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

  eachNode(callback: (node: IsSelectTreeNode, level: number) => any) {
    let level = 1;
    this.children.forEach((child: IsSelectTreeNode) => this.forEachNode(child, callback, level));
  }

  protected forEachNode(node: IsSelectTreeNode, callback: (node: IsSelectTreeNode, level: number) => any, level: number) {
    callback(node, level);
    let l = level + 1;
    node.children.forEach((child: IsSelectTreeNode) => this.forEachNode(child, callback, l));
  }

  protected forEachParentNode(node: IsSelectTreeNode, callback: (parent: IsSelectTreeNode, node: IsSelectTreeNode) => any) {
    node.children.forEach((child: IsSelectTreeNode) => {
      callback(node, child);
      this.forEachParentNode(child, callback);
    });
  }
}

export type IsSelectTreeChanges = { [id: number | string]: { [fieldName: string]: boolean } };

export class IsSelectTreeChangeEvent {

  changes: IsSelectTreeChanges = {};
  constructor(public saveFinished: () => void) {
  }

  /**
   * applies current changes to previous changes. Both events *MUST* have
   * same fields and this works only for single fieldsets
   * {IsSelectTreeChangeEvent} event [description]
   */
  applyTo(event: IsSelectTreeChangeEvent): IsSelectTreeChangeEvent {
    if (!event) {
      event = new IsSelectTreeChangeEvent(() => { return; });
    }
    const ret: IsSelectTreeChangeEvent = new IsSelectTreeChangeEvent(this.saveFinished);
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

export class IsSelectTree extends IsSelectTreeNode {

  changed: EventEmitter<IsSelectTreeChangeEvent> = new EventEmitter<IsSelectTreeChangeEvent>();
  indicateSaving: boolean = true;
  selectionFields: IsSelectField[] = [IsSelectField.selected()];

  constructor() {
    super(null, 'root');
    this.icon = '';
  }

  updateView() {
    this.eachNode((n: IsSelectTreeNode, level: number) => {
      n.onUpdateView.emit(null);
    });
  }

  update(changes: IsSelectTreeChanges): void {
    this.eachNode((n) => {
      const change = changes[n.id];
      if (change) {
        this.selectionFields.forEach((f) => {
          if (change[f.fieldName] !== undefined) {
            n.setValue(f, change[f.fieldName]);
            this.updateParentClasses(n, f);
          }
        });
      }
    });
    this.updateView();
  }

  setNodeValue(nodeId: number, field: IsSelectField, value: boolean) {
    this.eachNode((n: IsSelectTreeNode, level: number) => {
      if (n.id === nodeId) {
        n.setValue(field, value);
        this.updateParentClasses(n, field);
      }
    });
    const e = new IsSelectTreeChangeEvent(() => {
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
  updateParentClasses(node: IsSelectTreeNode, f: IsSelectField) {
    let parent: IsSelectTreeNode = node.parent;
    while (parent) {
      this.computeNodeClass(parent, f, true);
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
    let lastLevelParents: IsSelectTreeNode[] = [];
    this.children.forEach((root: IsSelectTreeNode) => {
      this.forEachParentNode(root, (parentNode: IsSelectTreeNode, child: IsSelectTreeNode) => {
        child.parent = parentNode;
        let isLastLevelParent: boolean = child.children.length > 0;
        child.children.forEach((grandChild: IsSelectTreeNode) => {
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
      let newParents: IsSelectTreeNode[] = [];
      lastLevelParents.forEach((node: IsSelectTreeNode) => {
        if (node.parent) {
          newParents.push(node.parent);
        }
        this.selectionFields.forEach((f: IsSelectField) => {
          this.computeNodeClass(node, f, true);
        });
      });
      lastLevelParents = newParents;
    }
  }

  private computeNodeClass(node: IsSelectTreeNode, f: IsSelectField, toParents = false) {
    node.$classes[f.fieldName] = this.getNodeClassHelper(node, f, toParents);
  }

  private getNodeClassHelper(node: IsSelectTreeNode, f: IsSelectField, toParents = false): string {
    const helper: any = {};
    node.children.forEach((child: IsSelectTreeNode) => {
      let clazz = child.$classes[f.fieldName];
      if (clazz) {
        helper[clazz] = child.getValue(f);
      }
      if (!child.isVirtual() && child.children.length > 0) {
        clazz = this.getNodeClassHelper(child, f, toParents);
        if (clazz) {
          helper[clazz] = child.getValue(f);
        }
      }
    });
    if (node.getValue(f) === true) {
      return node.$classes[f.fieldName];
    }
    const diff: number = Object.keys(helper).length;
    if (diff === 1) {
      const value = helper[Object.keys(helper)[0]];
      // we found only same classes - no change => inherit class
      return `${Object.keys(helper)[0]} ${toParents && value ? 'undetermined' : ''}`;
    } else if (diff > 1) {
      return `fa fa-fw ${f.iconIndeterminate}`;
    } else {
      return node.$classes[f.fieldName];
    }
  }

  static deserializeTree(root: IISTreeNode[], defaultIcon: string = null, ...fields: IsSelectField[]): IsSelectTree {
    const t: IsSelectTree = new IsSelectTree();
    t.selectionFields = fields;
    t.children = root.map((r) => IsSelectTreeNode.deserialize(r, defaultIcon, ...fields))
    t.initialize();
    return t;
  }

}

export class IsSelectField {
  name: string;
  fieldName: string;
  iconOn: string;
  iconOff: string;
  iconIndeterminate: string;
  dependentFieldName: string;

  static selected(): IsSelectField {
    let sf: IsSelectField = new IsSelectField();
    sf.name = 'shared.select-tree.selected';
    sf.iconOn = 'fa-regular fa-square-check';
    sf.iconOff = 'fa-regular fa-square';
    sf.iconIndeterminate = 'far fa-square-minus';
    sf.fieldName = 'IsSelected';
    return sf;
  }

  static applicable(): IsSelectField {
    let sf: IsSelectField = new IsSelectField();
    sf.name = 'shared.select-tree.selected';
    sf.iconOn = 'fa-regular fa-square-check';
    sf.iconOff = 'fa-regular fa-square';
    sf.iconIndeterminate = 'far fa-square-minus';
    sf.fieldName = 'IsApplicable';
    return sf;
  }

  static allowed(): IsSelectField {
    let sf: IsSelectField = new IsSelectField();
    sf.name = 'shared.select-tree.allowed';
    sf.iconOn = 'fa-regular fa-square-check';
    sf.iconOff = 'fa-regular fa-square';
    sf.iconIndeterminate = 'far fa-square-minus';
    sf.fieldName = 'IsAllowed';
    return sf;
  }

  static editable(): IsSelectField {
    let sf: IsSelectField = new IsSelectField();
    sf.name = 'shared.select-tree.editable';
    sf.iconOn = 'fa-regular fa-pen-to-square';
    sf.iconOff = 'fa-regular fa-square';
    sf.iconIndeterminate = `${sf.iconOn} undetermined`;
    sf.fieldName = 'IsEditable';
    return sf;
  }

  static visible(): IsSelectField {
    let sf: IsSelectField = new IsSelectField();
    sf.name = 'shared.select-tree.visible';
    sf.iconOn = 'fa-eye';
    sf.iconOff = 'fa-eye-slash';
    sf.iconIndeterminate = `${sf.iconOn} undetermined`;
    sf.fieldName = 'IsVisible';
    return sf;
  }

  static visibleEditable(): IsSelectField[] {
    return [IsSelectField.visible(), IsSelectField.editable().withDependentField('IsVisible')];
  }

  withDependentField(field: string): IsSelectField {
    this.dependentFieldName = field;
    return this;
  }
}
