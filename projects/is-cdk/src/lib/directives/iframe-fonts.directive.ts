import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: 'iframe[isIframeFonts]'
})
export class IsIFrameFontsDirective implements AfterViewInit, OnDestroy {

  private loadCallback: () => void;

  constructor(private el: ElementRef<HTMLIFrameElement>, private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    this.loadCallback = this.renderer.listen(this.el.nativeElement, 'load', () => {
      this.setIframeFonts();
    });
  }

  ngOnDestroy(): void {
    if (this.loadCallback) {
      this.loadCallback();
    }
  }

  private setIframeFonts() {
    const iframe: HTMLIFrameElement = this.el.nativeElement;
    const doc = iframe.contentDocument;

    document['fonts'].forEach((value) => {
      (doc['fonts'] as any).add(value);
    })
  }
}
