import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { parseCss, stringifyCss } from '@intelstudios/css';

let instanceCounter = 1;

@Component({
  selector: 'is-encapsulated',
  template: '<div></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsEncapsulatedComponent implements OnInit, OnChanges {

  @Input()
  html: string;

  constructor(private el: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
    instanceCounter = instanceCounter + 1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.html.currentValue !== changes.html.previousValue) {
      const contentChild = this.el.nativeElement.querySelector('div');
      const doc = document.createElement('div');
      const className = `enc-content-${instanceCounter}`
      doc.className = className;
      this.setInnerHTML(doc, this.html);
      let isError = false;
      doc.querySelectorAll('style').forEach((styleEl) => {
        try {
          const parsedCss = this.parseCss(styleEl.innerText);
          const prefix = `is-encapsulated > .${className}`;
          parsedCss.stylesheet.rules = parsedCss.stylesheet.rules.map((r) => this.processRule(r, prefix));
          const newStyle = document.createElement('style');
          newStyle.innerText = stringifyCss(parsedCss).replace(/\n/g, '');
          styleEl.parentNode.replaceChild(newStyle, styleEl);
        } catch (e) {
          isError = true;
          console.error(e);
          const errorComment = document.createComment(`CSS ERROR (${e}): "${styleEl.innerText}"`);
          styleEl.parentNode.replaceChild(errorComment, styleEl);
        }
      });
      if (isError) {
        const errorMark = document.createElement('span');
        errorMark.style.backgroundColor = 'red';
        errorMark.style.color = 'white';
        errorMark.innerText = 'CSS Error';
        errorMark.style.position = 'absolute';
        errorMark.style.top = '0px';
        errorMark.style.padding = '2px 4px';
        errorMark.style.fontSize = '75%';
        errorMark.style.borderRadius = '2px';
        doc.style.position = 'relative';
        doc.appendChild(errorMark);
      }
      this.el.nativeElement.replaceChild(doc, contentChild);
    }
  }

  private processRule(rule, prefix: string) {
    rule.selectors = rule.selectors?.map((s) => {
      const selector = s.replace('body', '');
      return `${prefix} ${selector}`;
    });
    if (rule.rules) {
      rule.rules = rule.rules.map((r) => this.processRule(r, prefix));
    }
    return rule;
  }

  private setInnerHTML(target: HTMLDivElement, html: string) {
    target.innerHTML = html;

    Array.from(target.querySelectorAll("script"))
      .forEach(oldScriptEl => {
        const newScriptEl = document.createElement("script");

        Array.from(oldScriptEl.attributes).forEach(attr => {
          newScriptEl.setAttribute(attr.name, attr.value)
        });

        const scriptText = document.createTextNode(oldScriptEl.innerHTML);
        newScriptEl.appendChild(scriptText);

        oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
      });
  }

  parseCss(style: string) {
    const css = this.preprocessCss(style);
    const parsedCss = parseCss(css);
    return parsedCss;
  }

  private preprocessCss(style: string): string {
    return style.replace(/<!--[^>]+>/g, '');
  }
}