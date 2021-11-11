import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: 'iframe[isIframeResize]'
})
export class IsIFrameResizeDirective implements AfterViewInit, OnDestroy {

  private loadCallback: () => void;

  private _intersectionObserver: IntersectionObserver;

  private resizingTimeout;

  constructor(private el: ElementRef<HTMLIFrameElement>, private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    this.loadCallback = this.renderer.listen(this.el.nativeElement, 'load', () => {
      this.resizeIframe();
    });
    this.connectIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.loadCallback) {
      this.loadCallback();
    }
    this.disconnectInterserctionObserver();
  }

  private connectIntersectionObserver() {
    this._intersectionObserver = new IntersectionObserver((entries) => {
      this.checkForIntersection(entries);
    }, {});
    this._intersectionObserver.observe(<Element>(this.el.nativeElement));
  }

  private disconnectInterserctionObserver() {
    if (this._intersectionObserver) {
      this._intersectionObserver.unobserve(<Element>(this.el.nativeElement));
      this._intersectionObserver.disconnect();
      this._intersectionObserver = undefined;
    }
  }

  private checkForIntersection = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target === this.el.nativeElement) {
        this.resizeIframe();
      }
    });
  }

  private resizeIframe() {
    const iframe = this.el.nativeElement;
    clearTimeout(this.resizingTimeout);
    this.resizingTimeout = setTimeout(() => {
      // takes too much space, but good for approximation
      const iframeHeight = iframe.scrollHeight;
      const { parentElement } = iframe;
      const parentStyle = window.getComputedStyle(parentElement);
      const parentPaddingTop = parseInt(parentStyle.paddingTop, 10);
      const parentPaddingBottom = parseInt(parentStyle.paddingBottom, 10);
      const containerHeight = iframe.parentElement.getBoundingClientRect().height - parentPaddingTop - parentPaddingBottom - 8;
      // precise, but can be null during first initialization
      if (iframe.contentDocument && iframe.contentDocument.body && iframe.contentDocument.body.parentElement) {
        const iframeContentHeight = iframe.contentDocument.body.parentElement.getBoundingClientRect().height;
        const initialHeight = (iframeContentHeight || iframeHeight);
        const height = Math.max(containerHeight, initialHeight);
        iframe.height = `${height}px`;
      }
    });
  }
}