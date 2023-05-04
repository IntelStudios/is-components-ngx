import { AfterViewInit, Directive, ElementRef, forwardRef, Inject, Input, Provider, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { conformToMask, createTextMaskInputElement, ITextMaskConfig } from '@intelstudios/text-utils';

const DEBUG = false;

const debug = DEBUG ? console.debug : (...params: any[]) => { };

const PLACEHOLDER_CHAR = '_';

export const MASKEDINPUT_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsInputMaskDirective),
  multi: true
}

@Directive({
  host: {
    '(input)': 'onInput($event.target.value)',
    '(onBlur)': 'onBlur($event)',
    '(focus)': 'onFocus($event)',
    // max length has no effect when inputMask is defined
    '[attr.maxlength]': 'xeMaxLength && !maskConfig ? xeMaxLength : null'
  },
  selector: '[isInputMask]',
  providers: [MASKEDINPUT_VALUE_ACCESSOR]
})
export class IsInputMaskDirective implements ControlValueAccessor, AfterViewInit {
  private textMaskInputElement: any
  private inputElement: HTMLInputElement

  /**
   * raw text value (without any placeholders)
   */
  private rawValue: string = '';

  @Input()
  xeMaxLength: number;

  @Input('isInputMask')
  maskConfig: ITextMaskConfig;

  get isMaskingActive(): boolean {
    return !!this.maskConfig;
  }


  _onTouched = () => { }
  _onChange = (_: any) => { }

  constructor(@Inject(Renderer2) private renderer: Renderer2, @Inject(ElementRef) private element: ElementRef) { }


  ngAfterViewInit() {
    if (!this.isMaskingActive) {
      return;
    }
    this.setupMask(true)
    if (this.textMaskInputElement !== undefined) {
      debug('set to ', this.rawValue);
      this.textMaskInputElement.update(this.rawValue);
    }
  }

  writeValue(value: any) {
    this.setupMask()
    // set the initial value for cases where the mask is disabled
    this.rawValue = value == null ? '' : value
    this.renderer.setProperty(this.inputElement, 'value', this.rawValue)

    if (this.textMaskInputElement !== undefined) {
      this.textMaskInputElement.update(this.rawValue)
    }
  }

  registerOnChange(fn: (value: any) => any): void { this._onChange = fn }

  registerOnTouched(fn: () => any): void { this._onTouched = fn }

  setDisabledState(isDisabled: boolean) {
    this.renderer.setProperty(this.element.nativeElement, 'disabled', isDisabled)
  }

  onFocus($event: FocusEvent) {
    // handle focus event, set cursor to the first PLACEHOLDER
    // but in case user sets cursor on any placeholder or the last character
    if (!this.isMaskingActive) {
      return;
    }
    const input: HTMLInputElement = $event.target as HTMLInputElement;
    const firstPlaceholderIndex = input.value.indexOf(PLACEHOLDER_CHAR);
    if (firstPlaceholderIndex > - 1) {
      setTimeout(() => {
        if (input.selectionStart === input.selectionEnd && (input.value[input.selectionStart] === PLACEHOLDER_CHAR || input.selectionStart === input.value.length)) {
          input.setSelectionRange(firstPlaceholderIndex, firstPlaceholderIndex);
        }
      });
    }
  }

  onBlur($event: any) {
    if (!this.isMaskingActive) {
      return;
    }
    debug('blur', $event.value, this.rawValue);
    $event.value = this.rawValue;
    this._onTouched();
  }

  onInput(value) {
    if (!this.isMaskingActive) {
      this._onChange(value);
      return;
    }
    debug('input', value);
    this.setupMask()
    if (this.textMaskInputElement !== undefined) {
      this.textMaskInputElement.update(value)

      const conformed = conformToMask(value, this.maskConfig.mask, { guide: false, showMask: false, placeholderChar: PLACEHOLDER_CHAR });
      debug('conformed', conformed, this.maskConfig);

      if (this.maskConfig.maskType !== 'email') {
        value = conformed.conformedValue.replace(/_/g, ''); // cleanup placeholder
      } else {
        // email mask should not clean up _ because it is valid email character
        value = conformed.conformedValue;
      }

      // this shit needs special handling, as email mask
      // returns conformed value "@ ." in case user clears the input
      if (this.maskConfig.maskType === 'email' && value === '@ .') {
        value = '';
      }
      // check against the last value to prevent firing ngModelChange despite no changes
      if (this.rawValue !== value) {
        this.rawValue = value
        this._onChange(value)
      }
    } else {
      this.rawValue = value;
      this._onChange(value);
    }
  }

  private setupMask(create = false) {
    if (!this.inputElement) {
      if (this.element.nativeElement.tagName === 'INPUT') {
        // `textMask` directive is used directly on an input element
        this.inputElement = this.element.nativeElement;
      } else {
        // `textMask` directive is used on an abstracted input element, `md-input-container`, etc
        this.inputElement = this.element.nativeElement.getElementsByTagName('INPUT')[0];
      }
    }

    if (this.inputElement && create) {
      if (this.maskConfig.mask !== false) {
        this.textMaskInputElement = createTextMaskInputElement(
          Object.assign({ inputElement: this.inputElement }, this.maskConfig)
        );
        debug('created', this.textMaskInputElement, this.maskConfig);
      }
    }
  }

}
