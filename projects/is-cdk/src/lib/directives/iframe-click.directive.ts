import { AfterViewInit, Directive, ElementRef, EventEmitter, NgZone, OnDestroy, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: 'iframe[isIframeClick]'
})
export class IsIFrameClickDirective implements AfterViewInit, OnDestroy {

  private loadCallback: () => void;

  @Output()
  isIframeClick: EventEmitter<MouseEvent> = new EventEmitter();

  constructor(
    private el: ElementRef<HTMLIFrameElement>,
    private zone: NgZone,
    private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    this.loadCallback = this.renderer.listen(this.el.nativeElement, 'load', () => {
      this.handleClicks();
    });
  }

  ngOnDestroy(): void {
    if (this.loadCallback) {
      this.loadCallback();
    }
  }



  private handleClicks() {
    const iframe = this.el.nativeElement;
    if (iframe.contentDocument && iframe.contentDocument.body) {
      iframe.contentDocument.onclick = (e: MouseEvent) => {
        e.preventDefault();
        this.zone.run(() => {
          this.isIframeClick.next(e)
        });
      }
    }
  }
}