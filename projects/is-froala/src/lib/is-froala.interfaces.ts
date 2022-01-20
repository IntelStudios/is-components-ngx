import { Observable } from 'rxjs';

export interface IsFroalaConfig {
  /**
   * function which returns license key for froala editor
   */
  getLicense(): string;
  getTheme?: () => FroalaTheme;
  defaultToolbarButtons?: string[];
}

export interface IIsFroalaOptions {
  /**
   * helper property which determines whole options object "version". Editor applies
   * changes only if this "id" differs from previously loaded options
   */
  id: number;
  /**
   * The list of allowed tags.
   */
  htmlAllowedTags?: string[];
  /**
   * The list of tags that are removed together with their content.
   */
  htmlRemoveTags?: string[];
  /**
   * The list of allowed attributes to be used for tags.
   */
  htmlAllowedAttrs?: string[];
  heightMin?: number;
  heightMax?: number;
  /**
   * atJS configuration
   */
  atjs?: IAtJSConfig;
  iframe?: boolean,
  /**
   * Observable of intellisense suggestions
   */
  intellisense?: Observable<IntellisenseSuggestion[]>;
  codeMirrorOptions?: any;
  placeholderText?: string;
  charCounterCount?: boolean,
  /**
   * Client language
   */
  language?: string;
}

export class IsFroalaOptions {

  static stylesStripped(): IIsFroalaOptions {
    return {
      id: 1,
      htmlRemoveTags: ['style']
    };
  }
}

export interface IntellisenseSuggestion {
  Code: string;
  Label: string;
  Description: string;
}

export class FroalaCommand {
  commandCode: string;

  onSuccess(data: any) {

  }

  static create(code: string, onSuccess: (data: any) => void) {
    const c: FroalaCommand = new FroalaCommand();
    c.commandCode = code;
    c.onSuccess = onSuccess;
    return c;
  }
}

export interface IAtJSConfig {
  at: string;
  data: any[];
  displayTpl: string;
  insertTpl: string;
  searchKey: string;
  limit: number;
  custom?: boolean; // wheather config is custom and is directly providing hardcoded data
  intellisense?: Observable<IntellisenseSuggestion[]>;
  intellisenseModal?: boolean;
}

export type FroalaTheme = 'dark' | null;
