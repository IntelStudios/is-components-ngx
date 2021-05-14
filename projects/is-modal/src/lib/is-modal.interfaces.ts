import { TemplateRef } from '@angular/core';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';

export interface IsModalRef {
  close: () => void;
}

export interface IsModalButtonConfig {
  /**
   * button class (ie. btn-primary)
   */
  buttonClass?: string;
  /**
   * icon (ie. fa fa-check)
   */
  icon?: string;
  /**
   * button title
   */
  title: string;
  /**
   * if set to false, button click will not close modal window
   */
  autoClose?: boolean;
  /**
   * click handler
   */
  onClick?: (ctrl: IsModalRef) => void
}

export interface IsModalConfig {
  /**
   * Modal title, if not set Modal header is hidden
   */
  title?: string;
  /**
   * if set to false, modal body will not have inner scrollbar
   */
  bodyScroll?: boolean;
  /**
   * Template to be placed into modal body
   */
  template: TemplateRef<any>;
  /**
   * Button definitions on the left side
   */
  buttonsLeft?: IsModalButtonConfig[];
  /**
   * Button definitions on the right side
   */
  buttonsRight?: IsModalButtonConfig[];
  /**
   * bootstrap modal options
   */
  options?: ModalOptions;
}

export interface IsModalInstance {
  control: IsModalControl;
  modal: ModalDirective;
}

export interface IsModalRef {
  close:() => void;
}

export interface IsModalControl {
  config: IsModalConfig;
  initialState?: any;
  hide:() => void;
}

export interface IsModalMovableConfig extends IsModalConfig {
  /**
   * Modal css class, if not set nothing will be added
   */
  cssClass?: string;
}

export interface IsModalMovableInstance {
  control: IsModalMovableControl;
  center:() => void;
}

export interface IsModalMovableControl {
  config: IsModalMovableConfig;
  initialState?: any;
  hide:() => void;
}

export interface IsModalMovableRef {
  close:() => void;
  /**
   * center movable modal on the screen
   */
  center:() => void;
  closed: boolean;
}
