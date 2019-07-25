import { TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

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
  onClick?: (modalRef: BsModalRef) => void
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
}
