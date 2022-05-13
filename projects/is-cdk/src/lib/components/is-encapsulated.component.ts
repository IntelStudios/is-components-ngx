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
    if (changes.html.currentValue) {
      const contentChild = this.el.nativeElement.querySelector('div');
      const doc = document.createElement('div');
      const className = `enc-content-${instanceCounter}`
      doc.className = className;
      doc.innerHTML = this.html;
      doc.querySelectorAll('style').forEach((styleEl) => {
        try {
          const parsedCss = parseCss(styleEl.innerText);
          parsedCss.stylesheet.rules.forEach((rule) => {
            rule.selectors = rule.selectors.map((s) => {
              const selector = s.replace('body', '');
              return `is-encapsulated > .${className} ${selector}`;
            });
          });
          const newStyle = document.createElement('style');
          newStyle.innerText = stringifyCss(parsedCss).replace(/\n/g, '');
          styleEl.parentNode.replaceChild(newStyle, styleEl);
        } catch (e) {
          console.error(e);
        }
      });
      this.el.nativeElement.replaceChild(doc, contentChild);
    }
  }
}