export interface IsColorItem {
  ID: string;
  Value: string;
  Object: string;
}

export interface IsSelectModelConfig {
  idProp: string;
  textProp: string;
  /**
   * additional object, if defined, will be used as base object for outputs
   * (baseModel's properties will be prepended to model being emitted on selection change)
   */
  baseModel?: any;
}
