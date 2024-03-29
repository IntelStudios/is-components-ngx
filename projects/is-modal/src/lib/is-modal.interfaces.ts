import { TemplateRef } from '@angular/core';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';

export interface IsDialogComponent<I, O> {
  modal: ModalDirective;
  modalConfig: ModalOptions;
  input: I;
  output: Observable<O>;
}

export interface IsModalRef {
  close: () => void;
  onClosed$: Observable<void>;
  closed: boolean;
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
  onClick?: () => void
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
   * Panel custom css class
   */
  panelCssClass?: string;
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

export interface IsModalControl {
  config: IsModalConfig;
  initialState?: any;
  hide: () => void;
}

export interface IsModalMovableConfig extends IsModalConfig {
  /**
   * Modal css class, if not set nothing will be added
   */
  cssClass?: string;
  /**
   * initial position of modal, if not set, modal is centered to screen
   */
  position?: Partial<{
    left: string;
    top: string;
  }>;
}

export interface IsModalMovableInstance {
  control: IsModalMovableControl;
  center: () => void;
}

export interface IsModalMovableControl {
  config: IsModalMovableConfig;
  initialState?: any;
  hide: () => void;
}

export interface IsModalMovableRef extends IsModalRef {
  /**
   * center movable modal on the screen
   */
  center: () => void;
}
