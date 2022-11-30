import { InjectionToken } from '@angular/core';

export interface IsColorItem {
  ID: string;
  Value: string;
  Object: string;
}

export interface IsSelectBadgeItem {
  icon?: string;
  ID: string | number;
  Value: string;
  cssClass?: string;
}

export interface IsSelectModelConfig {
  idProp: string;
  textProp: string;
  descProp?: string;
  objectProp?: string;
  /**
   * additional object, if defined, will be used as base object for outputs
   * (baseModel's properties will be prepended to model being emitted on selection change)
   */
  baseModel?: any;
}

export const createDefaultConfig = (): IsSelectConfig => ({
  attemptToProcessPasteMultipleSearch: false,
  defaultModelConfig: {
    idProp: 'ID',
    textProp: 'Value',
    objectProp: 'Object',
  },
  optionsOverflowWidth: false,
  onPasteSplitRegExp: /\s+|[,;|]/g,
  allowClear: false,
});

export type IsSelectButtonConfig = {
  label: string;
  cssClass: string;
};

export interface IsSelectMultipleConfig {
  showButtons?: boolean;
  selectAll? : IsSelectButtonConfig;
  deselectAll?: IsSelectButtonConfig;
}


export interface IsSelectConfig {
  /**
   * if set to true, is-select will try to convert selected value(s)
   * ID to int
   */
  convertValueIDToInt?: boolean;
  /**
   * Default model config. This will be used in case you use `[useModels]="true"`
   * but do not provide `[modelConfig]` input
   */
  defaultModelConfig?: IsSelectModelConfig;

  /**
   * Enable dropdown options to overflow control width
   */
  optionsOverflowWidth?: boolean;
  /**
   * default for [allowClear] input (allow user to clear selection)
   */
  allowClear?: boolean;
  /**
   * Attempt to parse pasted text for available ids for immediate selection in multiple search input box
   */
  attemptToProcessPasteMultipleSearch?: boolean,
  /**
   * When pasting to selects opts, attempts to split pasted stirng to match toknes opt ids to autoselect
   */
  onPasteSplitRegExp?: RegExp,
  /**
   * Close options when scrolling
   */
  closeOptionsOnScroll?: boolean;
}

export const configToken = new InjectionToken<IsSelectConfig>('IsSelectConfig');
