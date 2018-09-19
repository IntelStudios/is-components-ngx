import { Observable } from 'rxjs';

export interface IsFroalaConfig {
  getLicense(): string
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
  id: number; // helper property which determines whole object change (if changes)
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
