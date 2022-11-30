import { Component, OnInit, Input, ViewChild, OnDestroy, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { AvailbleBSPositions } from 'ngx-bootstrap/positioning';

@Component({
  selector: 'is-hint',
  templateUrl: './is-hint.component.html',
  styleUrls: ['./is-hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsHintComponent implements OnInit, OnDestroy {

  @Input()
  hint: string;

  @Input()
  hintTitle: string = 'Hint';

  @Input()
  placement: AvailbleBSPositions = 'right';

  @Input()
  icon: string = 'fa fa-info-circle';

  @ViewChild('popover')
  popover: PopoverDirective;

  private _documentClickListener: Function = null;

  constructor(private renderer: Renderer2, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this._documentClickListener) {
      this._documentClickListener();
    }
  }

  onPopoverShown() {
    setTimeout(() => {
      this._documentClickListener = this.renderer.listen('document', 'click', (event) => {
        this.onClick(event);
      });
    });
  }

  hintValue() {
    return this.sanitizer.bypassSecurityTrustHtml(this.hint);
  }

  onPopoverHidden() {
    if (this._documentClickListener) {
      this._documentClickListener();
    }
  }

  private onClick(event) {
    if (this.popover.isOpen) {
      const path: any[] = this.path(event.target);
      const popoverContainer: any = path.find((item: any) => item.localName === 'popover-container');
      if (!popoverContainer) {
        this.popover.hide();
      }
    }
  }

  private path(target: any) {
    var path = [];
    var currentElem = target;
    while (currentElem) {
      path.push(currentElem);
      currentElem = currentElem.parentElement;
    }
    if (path.indexOf(window) === -1 && path.indexOf(document) === -1)
      path.push(document);
    if (path.indexOf(window) === -1)
      path.push(window);
    return path;
  }
}
