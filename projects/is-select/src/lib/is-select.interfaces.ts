import { InjectionToken } from '@angular/core';

export interface IsColorItem {
  ID: string;
  Value: string;
  Object: string;
}

export interface IsSelectModelConfig {
  idProp: string;
  textProp: string;
  descProp?: string;
  /**
   * additional object, if defined, will be used as base object for outputs
   * (baseModel's properties will be prepended to model being emitted on selection change)
   */
  baseModel?: any;
}

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
}

export const configToken = new InjectionToken<IsSelectConfig>('IsSelectConfig');
