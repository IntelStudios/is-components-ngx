import { IsSelectOptionDirective } from './is-select.directives';
import { IsSelectMultipleConfig } from './is-select.interfaces';
import { SelectItem } from './select-item';

export interface ISelectOptionsControl {
    active: SelectItem | SelectItem[];
    optionTemplate: IsSelectOptionDirective;
    searchPlaceholder: string;
    options: SelectItem[];
    alignItems: 'left' | 'right';
    alignment: 'left' | 'right' | 'center';
    minLoadChars: number;
    isGroupOptions: boolean;
    isSearch: boolean;
    searchValue: string;
    multipleConfig: IsSelectMultipleConfig;
    onClosed: () => void;
    onLoadOptions: (filter: string) => void;
    onItemSelected: (item: SelectItem) => void;
    onItemUnselected: (item: SelectItem) => void;
    onItemsSelected: (visibleItems: SelectItem[]) => void;
    onItemsDeselected: () => void;
  }
