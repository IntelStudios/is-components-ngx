import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  HostBinding,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare var CodeMirror: any;

@Component({
  selector: 'is-codemirror',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IsCodemirrorComponent),
      multi: true
    }
  ],
  template: `
  <textarea #host></textarea>
    <div class="disabled-overlay"></div>
    <span *ngIf="isTranslation" class="cm-tooltip" [style.top]="topPos + 'px'" [style.left]="leftPos + 'px'">
      {{translation}}
    </span>`,
  styleUrls: ['./is-codemirror.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsCodemirrorComponent implements ControlValueAccessor, OnDestroy {

  topPos: number;
  leftPos: number;

  translation: string = '';
  isTranslation: boolean = false;

  private _cursorActivityFnc: Function = null;

  @Input()
  set config(value: any) {
    this._config = Object.assign(this._config, value);
    if (this.instance) {
      Object.keys(value).forEach((key: string) => {
        this.instance.setOption(key, value[key]);
      });

      if (this._config.hintOptions) {
        this.tooltipInit();
      }
    }
  }

  get config(): any {
    return this._config;
  }

  @Input()
  singleLine: boolean = false;

  @Output() change = new EventEmitter();
  @Output() focus = new EventEmitter();
  @Output() blur = new EventEmitter();

  @ViewChild('host', { static: true }) host;

  @Output() instance = null;

  @HostBinding('class.is-cm-disabled')

  @Input()
  set disabled(value: boolean) {
    this.setDisabledState(value);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  _disabled: boolean = false;

  _value = '';
  _config: any = {
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
    readOnly: this._disabled ? 'nocursor' : false,
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
    tabSize: 2,
    viewportMargin: Infinity, // enable autoresize together with CSS style for .CodeMirror
    //mode: 'text/x-mssql'
    mode: 'application/json'
  };

  /**
   * Constructor
   */
  constructor(private changeDetector: ChangeDetectorRef) { }

  get value() { return this._value; };

  @Input() set value(v) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  setFocus() {
    if (this.instance) {
      this.instance.focus();
    }
  }

  /**
   * On component destroy
   */
  ngOnDestroy() {
    this.instance.toTextArea();
    this.tooltipDestroy();
  }

  /**
   * On component view init
   */
  ngAfterViewInit() {
    this.changeDetector.markForCheck();
    this.codemirrorInit(this.config);
  }

  /**
   * Initialize codemirror
   */
  codemirrorInit(config) {

    const self: IsCodemirrorComponent = this;

    this.instance = CodeMirror.fromTextArea(this.host.nativeElement, config);

    if (config.hintOptions) {
      this.tooltipInit();
    }

    this.instance.setValue(this._value);

    this.instance.on('change', () => {
      self.closeTooltip();
      this.updateValue(this.instance.getValue());
    });

    this.instance.on('focus', () => {
      self.closeTooltip();
      this.focus.emit();
    });

    this.instance.on('blur', () => {
      self.closeTooltip();
      this.blur.emit();
    });

    if (this.singleLine) {
      //this.instance.setSize(200, this.instance.defaultTextHeight() + 2 * 4);
      // 200 is the preferable width of text field in pixels,
      // 4 is default CM padding (which depends on the theme you're using)

      // now disallow adding newlines in the following simple way
      this.instance.on('beforeChange', function (instance, change) {
        var newtext = change.text.join('').replace(/\n/g, ''); // remove ALL \n !
        change.update(change.from, change.to, [newtext]);
        return true;
      });
    }
  }

  /**
   * Value update process
   */
  updateValue(value) {
    this.value = value;
    this.onTouched();
    this.change.emit(value);
  }

  /**
   * Implements ControlValueAccessor
   */
  writeValue(value) {
    this._value = value || '';
    if (this.instance) {
      this.instance.setValue(this._value);
    }
  }
  /**
   * Implemented as part of ControlValueAccessor.
   */
  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;

    if (this.instance) {
      this.instance.setOption('readOnly', isDisabled ? 'nocursor' : false);
    }
  }

  onChange(_) { }
  onTouched() { }
  registerOnChange(fn) { this.onChange = fn; }
  registerOnTouched(fn) { this.onTouched = fn; }

  private tooltipInit() {

    const self: IsCodemirrorComponent = this;

    this._cursorActivityFnc = function (instance) {
      try {
        self.closeTooltip();

        let leftPos: number = instance.getCursor(true).ch;
        let rightPos: number = instance.getCursor(false).ch;

        if (leftPos < rightPos) {
          let lineContent = instance.getLine(instance.getCursor().line);    // get the line contents
          let selected: string = lineContent.substring(leftPos, rightPos);  // get selection

          if (selected.match(/^id+\d+$/) || selected.match(/^id+\d+[a-zA-Z]$/)) {
            //get translation from config
            let item = self._config.hintOptions.intellisense.find((item: any) => item.text === selected);
            if (item) {
              self.translation = item.name;
              //enable tooltip
              self.translation.length > 0 ? self.isTranslation = true : self.isTranslation = false;

              //set coords for tooltip
              self.topPos = instance.cursorCoords().top - instance.display.input.cm.display.wrapper.getBoundingClientRect().y;
              self.leftPos = instance.cursorCoords().left - instance.display.input.cm.display.wrapper.getBoundingClientRect().x;

              //when we are using tooltip from modal we need to fix positions
              //now applicable for object calculation editor modal and subgrid calculation editor modal
              if (self.config['source'] && self.config['source'] === 'modal') {
                self.topPos += 15;
                self.leftPos += 10;
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    this.instance.on('cursorActivity', this._cursorActivityFnc);
  }

  private tooltipDestroy() {
    if (this._cursorActivityFnc) {
      this.instance.off('cursorActivity', this._cursorActivityFnc);
    }
  }

  private closeTooltip() {
    this.isTranslation = false;
    this.changeDetector.markForCheck();
  }

}
