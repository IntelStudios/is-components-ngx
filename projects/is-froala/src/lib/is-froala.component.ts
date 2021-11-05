import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SecurityContext,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';

import {
  FroalaCommand,
  IAtJSConfig,
  IIsFroalaOptions,
  IntellisenseSuggestion,
  IsFroalaConfig,
} from './is-froala.interfaces';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

// enable/disable component debug logging
const DEBUG = false;

const noop = (...params: any[]) => { };

function debugFn(prefix: string): (message?: any, ...params: any[]) => void {
  return (message?: any, ...params: any[]) => {
    if (message) {
      message = `${prefix}: ${message}`;
    }
    console.debug(message, ...params);
  }
}

const debug = DEBUG ? debugFn('FROALA') : noop;
const time = DEBUG ? console.time : noop;
const timeEnd = DEBUG ? console.timeEnd : noop;

const BTN_INTELLISENSE = 'intellisense';

const DEFAULT_TOOLBAR = ['paragraphFormat', '|', 'bold', 'italic', 'underline', 'strikeThrough', '|',
  'fontFamily', 'fontSize', 'color', 'paragraphStyle', '|', 'align', 'formatOL',
  'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'embedly',
  'insertTable', '|', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|',
  'print', 'spellChecker', 'help', 'html', '|', 'fullscreen', '|', BTN_INTELLISENSE];

interface ICustomButton {
  name: string;
  configProperty: string;
}

const CUSTOM_BUTTONS: ICustomButton[] = [
  { name: BTN_INTELLISENSE, configProperty: 'intellisenseModal' }
];

const IS_FROALA_EDITOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsFroalaComponent),
  multi: true
};

const IS_FROALA_EDITOR_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => IsFroalaComponent),
  multi: true
}

export const configToken = new InjectionToken<IsFroalaConfig>('IsFroalaConfig');

@Component({
  selector: 'is-froala',
  templateUrl: 'is-froala.component.html',
  providers: [IS_FROALA_EDITOR_VALUE_ACCESSOR, IS_FROALA_EDITOR_VALIDATORS],
  styleUrls: ['./is-froala.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsFroalaComponent implements ControlValueAccessor, Validator, OnInit, AfterViewInit, OnDestroy {

  // content of the editor
  value: string;

  private _froalaConfig: any = null;
  private _intellisenseSub: Subscription;

  private _htmlEditorActive = false;
  // configuration and data for intellisense
  private _atJsConfig: IAtJSConfig = null;

  // validation change function
  onValidatorChangeFn: Function = null;

  private _options: IIsFroalaOptions = null;
  // froala editor instance
  @HostBinding('class.editing')
  editor: any;

  private _eventListeners: string[] = [];
  // jquery wrapped element
  private _$element: any;

  private _html: SafeHtml;

  @HostBinding('class.disabled')
  disabled: boolean = false;


  @Input()
  set options(config: IIsFroalaOptions) {
    if (config) {
      if (!this._options || (config.id && this._options.id !== config.id)) {
        this._options = config;
        this.setCustomButtonsVisibility();
        // enable and configure autocomplete
        this.initAutocomplete();
      }
    }
  }
  get options(): IIsFroalaOptions {
    return this._options;
  }

  private _maxEditorHeightDefault = 210;
  private _maxEditorHeight = this._maxEditorHeightDefault;

  /**
   * Sets the max height of the preview and editing window (excluding toolbar)
   * @param value new max height, 0 or null for default value
   */
  @Input()
  set maxHeight(value: number | null) {
    const { style } = this.el.nativeElement;
    if (value) {
      this._maxEditorHeight = value;
      style.setProperty('--is-froala-max-height', `${value}px`);
    } else {
      this._maxEditorHeight = this._maxEditorHeightDefault;
      style.removeProperty('--is-froala-max-height');
    }
  }

  private _minEditorHeightDefault = 210;
  private _minEditorHeight = this._minEditorHeightDefault;

  /**
   * Sets the min height of the preview and editing window (excluding toolbar)
   * @param value new min height, 0 or null for default value
   */
  @Input()
  set minHeight(value: number | null) {
    const { style } = this.el.nativeElement;
    if (value) {
      this._minEditorHeight = value;
      style.setProperty('--is-froala-min-height', `${value}px`);
    } else {
      this._minEditorHeight = this._minEditorHeightDefault;
      style.removeProperty('--is-froala-min-height');
    }
  }

  @Input()
  codeviewActiveValidationError: any = { codeViewActive: true };

  @Input()
  licenseKey: string;

  @Input()
  loadOnInit: boolean = true;

  @Input()
  set html(value: string | null) {
    this._html = this.sanitizer.bypassSecurityTrustHtml(value !== null ? value : '');
  }

  get htmlContent(): SafeHtml {
    return this._html;
  }

  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  onCommand: EventEmitter<FroalaCommand> = new EventEmitter<FroalaCommand>();

  constructor(@Optional() @Inject(configToken) private froalaConfig: IsFroalaConfig,
    private changeDetector: ChangeDetectorRef,
    private el: ElementRef,
    private zone: NgZone,
    private sanitizer: DomSanitizer,
    private translate: TranslateService) {
    if (!froalaConfig) {
      console.warn(`IS-FROALA: Config not provided. Will not load license (use IsFroalaModule.forRoot() )`);
      this.froalaConfig = {
        getLicense: () => {
          return '';
        }
      }
    }
  }

  ngOnInit() {
    // jquery wrap and store element
    this._$element = (<any>$(this.el.nativeElement));
  }

  ngOnDestroy() {
    if (this._intellisenseSub) {
      this._intellisenseSub.unsubscribe();
    }

    this.destroyEditor();
  }

  ngAfterViewInit() {
    if (this.loadOnInit) {
      setTimeout(() => {
        this.createEditor();
      });
    }
  }


  loadEditor() {
    if (!this.disabled) {
      if (this._minEditorHeight === this._minEditorHeightDefault) {
        const toolbarRows = this.froalaConfig && this.froalaConfig.defaultToolbarButtons
          ? this.froalaConfig.defaultToolbarButtons.filter((str) => str === '-').length + 1
          : DEFAULT_TOOLBAR.filter((str) => str === '-').length + 1;
        // measure current container - 38 (toolbar height - expecting 1 row)
        this._minEditorHeight = parseInt(this.el.nativeElement.offsetHeight) - (toolbarRows * 38);
        this._maxEditorHeight = this._minEditorHeight;
      }
      this.createEditor();
    }
  }

  // Begin ControlValueAccesor methods
  onChange = (_) => { };
  onTouched = () => { };

  // Form model content changed.
  writeValue(value: any): void {
    debug('writeValue');
    this.value = value;
    this.setEditorValue();
    this.changeDetector.markForCheck();
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  // End ControlValueAccesor methods

  // Begin Validators methods
  validate(c: AbstractControl) {
    return this._htmlEditorActive ? this.codeviewActiveValidationError : null;
  }

  registerOnValidatorChange(fn: any) {
    this.onValidatorChangeFn = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.changeDetector.markForCheck();
    if (this.editor) {
      this._$element.froalaEditor(this.disabled ? 'edit.off' : 'edit.on');
    }
  }

  onIframeClick(e: MouseEvent): void  {
    const isLink = (e.target as HTMLElement).localName === 'a';
    if (isLink) {
      const target = e.target as HTMLAnchorElement;
      window.open(target.href, '_blank');
      return;
    }
    if (!this.disabled) {
      this.loadEditor();
    }
  }

  // End Validators methods

  private setEditorValue() {
    if (this.editor) {
      time('set value');
      this._$element.froalaEditor('html.set', this.value);
      // reset undo/history when value is set externally
      this._$element.froalaEditor('undo.reset');
      this._$element.froalaEditor('undo.saveStep');
      timeEnd('set value');
    } else {
      this.html = this.value;
    }
  }

  private createFroalaConfig(): any {

    const defaults: any = {
      key: this.froalaConfig.getLicense(),
      charCounterCount: false,     // shows character counter in bottom right corner
      iframe: true,               // component container is in iframe
      htmlAllowedTags: ['.*'],    // enable all html tags
      htmlRemoveTags: ['script'],       // do not remove any html tags
      htmlExecuteScripts: false, // disable script execution within froala
      heightMin: this._minEditorHeight,             // min height of editor
      heightMax: this._maxEditorHeight,             // max height of editor - scrollbar appears
      quickInsertTags: [''],      // disable quick insert button on the left edge of editor
      placeholderText: '',        // disable placeholder
      toolbarSticky: false,       // when scrolling toolbar does not appear on the top of the screen
      toolbarButtons: DEFAULT_TOOLBAR,    // list of toolbar buttons
      codeMirrorOptions: {
        indentWithTabs: true,
        lineNumbers: true,
        lineWrapping: true,
        mode: 'text/html',
        tabMode: 'indent',
        tabSize: 2,
        viewportMargin: Infinity
      },
      events: {},
    };
    if (this.froalaConfig) {
      if (this.froalaConfig.defaultToolbarButtons) {
        defaults.toolbarButtons = this.froalaConfig.defaultToolbarButtons;
      }
    }

    if (this._options && this._options.language) {
      defaults.language = this._options.language;
    } else {
      const languageMap = {
        'pt': 'pt_pt',
        'zh-cn': 'zh_cn',
        'zh_tw': 'zh-tw'
      };
      defaults.language = languageMap[this.translate.currentLang] || this.translate.currentLang;
    }

    this.mergeOptions(defaults, this.options);
    // delete observables & atjs config
    // both can fail JSON.stringify(defaults) (internally used in froala)
    delete defaults.intellisense;
    delete defaults.atjs;

    // TODO add config option for this custom button
    $.FroalaEditor.DefineIcon(BTN_INTELLISENSE, { NAME: 'hand-o-up' });
    $.FroalaEditor.RegisterCommand(BTN_INTELLISENSE, {
      title: 'Intellisense',
      focus: false,
      undo: false,
      refreshAfterCallback: false,

      callback: function () {
        // icon functionality
        debug('emit intellisense command');
        // [THIS] is a particular _editor instance (we previously assigned "onCommand" emitter and "cmdIntellisense")
        this.onCommand.emit(this.cmdIntellisense);
      }
    });

    defaults.events['froalaEditor.initialized'] = ((e, editor) => {
      this.setCustomButtonsVisibility();
      if (this.disabled) {
        editor.edit.off();
      }
    }).bind(this);

    // before we use blur event, but it is not fire event when style of content was changed
    defaults.events['froalaEditor.contentChanged'] = ((e) => {
      debug(e);
      this.zone.run(() => {
        time('updateModel');
        time('getHTML')
        const html = this._$element.froalaEditor('html.get');
        timeEnd('getHTML');
        if (html !== this.value) {
          debug('trigger onChange');
          this.value = html;
          this.emitChange();
        }
        timeEnd('updateModel');
      });
    }).bind(this);

    // default event, stores images in base64 format
    defaults.events['froalaEditor.image.beforeUpload'] = (e, editor, files) => {
      if (files.length) {
        // Create a File Reader.
        const reader = new FileReader();

        // Set the reader to insert images when they are loaded.
        reader.onload = function (e) {
          const eventTarget = <FileReader>e.target;
          editor.image.insert(eventTarget.result, null, null, editor.image.get());
        };

        // Read image as base64.
        reader.readAsDataURL(files[0]);
      }

      editor.popups.hideAll();

      // Stop default upload chain.
      return false;
    };

    // listen to codeview button click
    defaults.events['froalaEditor.commands.before'] = (e, editor, cmd, param1, param2) => {
      if (cmd === 'html') {
        this._htmlEditorActive = !this._htmlEditorActive;
        this.emitChange();
      }
    }
    return defaults;
  }

  private mergeOptions(defaults: any, options: any) {
    if (!options) {
      return;
    }
    Object.keys(options)
      .forEach(key => {
        const val = options[key];
        if (Array.isArray(val)) {
          if (val.length === 0) {
            defaults[key] = val;
          } else {
            defaults[key].push(...val);
          }
        } else {
          defaults[key] = options[key];
        }
      });
  }

  private setCustomButtonsVisibility() {
    CUSTOM_BUTTONS.forEach((b: ICustomButton) => {
      const btn = this.el.nativeElement.querySelector(`[data-cmd="${b.name}"]`);
      if (btn) {
        if (this.options && this.options[b.configProperty]) {
          btn.classList.remove('is-button-hidden');
        } else {
          btn.classList.add('is-button-hidden');
        }
      }
    });
  }

  private emitChange() {
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  // initialize of autocomplete - if intellisense data are availaible
  private initAutocomplete() {
    if (this._intellisenseSub) {
      this._intellisenseSub.unsubscribe();
    }

    // default usage with intellisense data from backend
    if (this.options && this.options.intellisense) {
      const suggestions: Observable<IntellisenseSuggestion[]> = this.options.intellisense;

      this._intellisenseSub = suggestions.subscribe((data: IntellisenseSuggestion[]) => {
        this._atJsConfig = this.createAtJsConfiguration(data);
        this.setupAtJs();
      });
      // when we want to use intellisense with custom static data
    } else if (this.options && this.options.atjs) {

      // this config is our at js config which comes from input
      this._atJsConfig = this.options.atjs;

      this.setupAtJs();
    }
  }

  /**
   * setup At.js intellisense
   */
  private setupAtJs() {
    if (this.editor && this._atJsConfig) {
      this.editor.$el
        .atwho(this._atJsConfig)
        .on('inserted.atwho', () => {
          // we need to edit also text, which was added by autocomplete
          this.editor.$el.find('.atwho-inserted').removeAttr('contenteditable').removeAttr('data-atwho-at-query');
        })

      this.editor.events.on('keydown', (e) => {
        if (e.which == $.FroalaEditor.KEYCODE.ENTER && this.editor.$el.atwho('isSelecting')) {
          return false;
        }
      }, true);
    }
  }

  // create editor instance
  private createEditor() {
    if (this.editor) {
      return;
    }
    time('createEditor');

    // get default config
    this._froalaConfig = this.createFroalaConfig();
    debug('OPTIONS', this._froalaConfig);
    time('registerEvents');

    for (const e in this._froalaConfig.events) {
      if (this._froalaConfig.events.hasOwnProperty(e)) {
        debug(`Register event ${e}`);
        this._eventListeners.push(e);
        this._$element.on(e, this._froalaConfig.events[e]);
      }
    }
    timeEnd('registerEvents');

    // init editor
    time('runOutsideAngular')
    this.zone.runOutsideAngular(() => {
      this.editor = this._$element.froalaEditor(this._froalaConfig).data('froala.editor');
      debug('editor created', this.editor);
      this.setEditorValue();
      this.initAutocomplete();

      // TODO add config option for this custom button
      // intellisense command
      const cmd: FroalaCommand = FroalaCommand.create('froala-intellisense', (data: any) => {
        console.log(`comand success, result`, data);
        this._$element.froalaEditor('html.insert', data, true);
        this._$element.froalaEditor('events.trigger', 'contentChanged', [], true);
      });
      this.editor.cmdIntellisense = cmd;
      this.editor.onCommand = this.onCommand;

    });
    timeEnd('runOutsideAngular')

    timeEnd('createEditor');
  }

  // Intellisense config for at.js - autocomplete
  private createAtJsConfiguration(intellisenseSuggestions: IntellisenseSuggestion[]): IAtJSConfig {

    // build data to be used in At.JS config - autocomplete
    if (intellisenseSuggestions && intellisenseSuggestions.length > 0) {
      const suggestions: Object[] = intellisenseSuggestions.map((suggestion: IntellisenseSuggestion, index: number) => {
        return {
          id: index, code: suggestion.Code, displayText: suggestion.Label, description: suggestion.Description
        };
      });
      // Define config for At.JS - autocomplete
      const config: IAtJSConfig = {
        at: '{',
        data: suggestions,
        displayTpl: '<li>${code} <small>${description}</small></li>',
        insertTpl: '{${code}}',
        searchKey: 'code',
        limit: 200,
      }
      return config;
    }
    return null;
  }

  private destroyEditor() {
    if (this.editor) {
      debug('Destroy editor');
      this._$element.off(this._eventListeners.join(' '));
      this.editor.$el.off('keyup');
      this._$element.froalaEditor('destroy');
      this._eventListeners = [];
      this.editor = null;
    }
  }

}
