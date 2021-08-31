import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, interval, merge, Subscription, bindCallback, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

let nextId = 0;

export const SCROLL_BY: number = 50;
/**
 * The payload of the change event fired right before the tab change
 */
export interface TabChangeEvent {
  /**
   * Id of the currently active tab
   */
  activeId: string;

  /**
   * Id of the newly selected tab
   */
  nextId: string;

  forced: boolean;

  /**
   * Function that will prevent tab switch if called
   */
  preventDefault: () => void;
}

/**
 * This directive should be used to render invalid content, which appears
 * when there is an invalid tab not visible by user because of wrap feature
 */
@Directive({ selector: 'ng-template[TabsetInvalid]' })
export class IsTabsetInvalidDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

/**
 * This directive should be used to wrap tab titles that need to contain HTML markup or other directives.
 */
@Directive({ selector: 'ng-template[TabTitle]' })
export class IsTabTitleDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
@Directive({ selector: 'ng-template[TabContent]' })
export class IsTabContentDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

/**
 * A directive representing an individual tab.
 */
@Directive({ selector: 'is-tab' })
export class IsTabDirective {
  /**
   * Unique tab identifier. Must be unique for the entire document for proper accessibility support.
   */
  @Input() id: string = `is-tab-${nextId++}`;
  /**
   * Simple (string only) title. Use the "NgbTabTitle" directive for more complex use-cases.
   */
  @Input() title: string;

  @Input() titleClass: string = '';
  /**
   * Allows toggling disabled state of a given state. Disabled tabs can't be selected.
   */
  @Input() disabled = false;

  /**
   * Valid/invalid tab incidation. This allows to incidate invalid tab in tabset
   * which is not visible to user (because of wrap being enabled)
   */
  @Input()
  set valid(value: boolean) {
    this._valid = value;
    if (this.tabset && (value === true || value === false)) {
      this.tabset.updateValidityIndication();
    }
  }
  get valid(): boolean {
    return this._valid;
  }
  private _valid = true;
  /**
   * set wheather tab content should be lazy-loaded or not. Default is false,
   * so tab's content is immediately rendered. If set to `true` tab's content
   * is loaded when selected for the 1st time
   */
  @Input() load: 'always' | 'activeOnly' | 'selected' = 'always';

  @ContentChild(IsTabContentDirective, { static: true }) contentTpl: IsTabContentDirective;
  @ContentChild(IsTabTitleDirective, { static: true }) titleTpl: IsTabTitleDirective;

  loaded: boolean = false;

  private tabset: IsTabsetComponent;

  constructor() {

  }


  /**
   * *internal use only*
   */
  registerTabset(tabset: IsTabsetComponent) {
    this.tabset = tabset;
  }
}

/**
 * A component that makes it easy to create tabbed interface.
 */
@Component({
  selector: 'is-tabset',
  styleUrls: ['is-tabset.component.scss'],
  template: `
    <div class="tab-header">
      <ul [class]="tabClass" role="tablist" [class.stretched]="stretched">
        <li class="nav-item" *ngFor="let tab of tabs" [class.disabled]="tab.disabled" [class.is-tab-invalid]="tab.valid === false">
          <a [id]="tab.id" class="nav-link {{tab.titleClass}}" [ngClass]="{'active show' : tab.id === activeId}" (click)="select(tab.id)">
            {{tab.title}}<ng-template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></ng-template>
          </a>
        </li>
      </ul>
      <div class="scroll-btn left"><i class="fas fa-chevron-left" (click)="scrollRight()" (mousedown)="startScrollRight()" (mouseup)="stopScroll()"></i></div>
      <div class="scroll-btn right"><i class="fas fa-chevron-right" (click)="scrollLeft()" (mousedown)="startScrollLeft()" (mouseup)="stopScroll()"></i></div>
    </div>

    <div *ngIf="tabsetInvalidLeft" class="tabset-invalid left">
      <ng-container [ngTemplateOutlet]="tabsetInvalidTemplate || defaultInvalidTemplate">
      </ng-container>
    </div>
    <div *ngIf="tabsetInvalidRight" class="tabset-invalid right">
      <ng-container [ngTemplateOutlet]="tabsetInvalidTemplate || defaultInvalidTemplate">
      </ng-container>
    </div>
    <ng-template #defaultInvalidTemplate>
      <i class="fas fa-exclamation"></i>
    </ng-template>
    <div class="tab-content" [class.pills]="pills" *ngIf="tabs.length > 0">
      <ng-template ngFor let-tab [ngForOf]="tabs">
        <div class="tab-pane" [ngClass]="{'active show' : tab.id === activeId}" *ngIf="tab.loaded || tab.id === activeId" role="tabpanel" [attr.aria-labelledby]="tab.id">
          <ng-template [ngTemplateOutlet]="tab.contentTpl.templateRef"></ng-template>
        </div>
      </ng-template>
    </div>
  `,
})
export class IsTabsetComponent implements AfterContentChecked, AfterContentInit, OnInit, OnDestroy, AfterViewInit {
  /**
   * An identifier of an initially selected (active) tab. Use the "select" method to switch a tab programmatically.
   */
  @Input() activeId: string;

  /**
   * Sets stretched display behavior. If Enabled, tab titless will stretch to max available space. If disabled
   * tab titles will go from right to left
   */
  @Input() stretched: boolean = false;

  @Input() enableRouting: boolean;

  /**
   * enable to change from (default) tab style to pills style
   */
  @Input()
  set pills(pills: boolean) {
    this._pills = pills;
    this.tabClass = pills ? 'nav nav-pills' : 'nav nav-tabs';
  }
  get pills(): boolean {
    return this._pills;
  }

  private _pills: boolean = false;
  tabClass: string = 'nav nav-tabs';

  /**
   * Enable / disable tab wrap feature. If enabled, tab titles will remain in a single row with
   * scroll. If disabled, tab titles will wrap.
   */
  @Input() nowrap: boolean = true;

  /**
   * Set scrollable tabset feature.
   * none - default scrolling type (scroll whole page)
   * sticky-headers - sticky tabset headers (use when two tabsets in one row and want to scroll each other)
   * scrollable-tabcontent - tabcontent scrolling content (use when two tabsets in one row and want to scroll everyone separately)
   */
  @Input()
  scrollableMode: 'none' | 'sticky-headers' | 'scrollable-tabcontent' = 'none';

  /**
   * A tab change event fired right before the tab selection happens. See NgbTabChangeEvent for payload details
   */
  @Output() tabChange = new EventEmitter<TabChangeEvent>();

  @ContentChildren(IsTabDirective) tabs: QueryList<IsTabDirective>;

  @ContentChild(IsTabsetInvalidDirective, { static: false, read: TemplateRef })
  tabsetInvalidTemplate: IsTabsetInvalidDirective

  tabsetInvalidLeft: boolean = false;
  tabsetInvalidRight: boolean = false;


  private isSelecting: boolean = false;

  private elUL: HTMLUListElement;

  private elBtnLeft: HTMLDivElement;
  private elBtnRight: HTMLDivElement;

  private _sub: Subscription;
  private _scrollSub: Subscription;
  private _updateValidity$: Subject<any> = new Subject();
  private _updateValiditySub: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private el: ElementRef, private renderer: Renderer2, private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {

    if (this.scrollableMode && this.scrollableMode != 'none') {
      this.el.nativeElement.classList.add(this.scrollableMode);
    }

    if (this.nowrap) {
      this.elUL = this.el.nativeElement.querySelector('ul');
      this.elBtnLeft = this.el.nativeElement.querySelector('div.left');
      this.elBtnRight = this.el.nativeElement.querySelector('div.right');

      const sources = [
        fromEvent(this.elUL, 'scroll', { passive: true }),
        fromEvent(window, 'resize', { passive: true })
      ];

      this._sub = merge(...sources)
        .subscribe(() => {
          this.updateScrollBtnVisibility();
        });

      this._updateValiditySub = merge(...sources, this._updateValidity$.asObservable())
        .pipe(debounceTime(200))
        .subscribe(() => {
          if (!this.elUL) {
            return;
          }
          const ulRect = this.elUL.getBoundingClientRect();
          const width = ulRect.left + this.elUL.clientWidth;
          const tabs = this.elUL.querySelectorAll('ul > .is-tab-invalid');

          this.tabsetInvalidRight = false;
          this.tabsetInvalidLeft = false;
          tabs.forEach(t => {
            const rect = t.getBoundingClientRect();
            if (rect.left < ulRect.left) {
              this.tabsetInvalidLeft = true;
            }
            if (rect.left + (rect.width - 1) > width) {
              this.tabsetInvalidRight = true;
            }
          });
          this.tabsetInvalidRight;
          this.changeDetector.markForCheck();
        });
    }
  }

  ngOnDestroy() {
    if (this._updateValidity$) {
      this._updateValiditySub.unsubscribe();
    }
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.updateScrollBtnVisibility();

  }

  ngAfterContentInit() {
    //set internal loaded state based on input lazyLoad option
    this.tabs.forEach((t: IsTabDirective) => {
      t.registerTabset(this);
      if (!t.loaded) {
        t.loaded = t.load === 'always';
      } else {
        t.loaded = t.load !== 'activeOnly';
      }
    });
    this.updateValidityIndication();
  }

  ngAfterContentChecked() {
    // // auto-correct activeId that might have been set incorrectly as input
    let activeTab = this._getTabById(this.activeId);
    if (activeTab) {
      this.activeId = activeTab.id;
    } else if (this.tabs.length) {
      activeTab = this.tabs.first;
      activeTab.loaded = true;
      this.activeId = activeTab.id;
    }
  }

  /**
   * Selects the tab with the given id and shows its associated pane.
   * Any other tab that was previously selected becomes unselected and its associated pane is hidden.
   */
  select(tabId: string, force?: boolean) {
    if (this.isSelecting) {
      return;
    }
    let selectedTab = this._getTabById(tabId);
    if (selectedTab && !selectedTab.disabled && this.activeId !== selectedTab.id) {
      let defaultPrevented = false;

      if (force === undefined) {
        force = false;
      }
      this.tabChange.emit(
        { forced: force, activeId: this.activeId, nextId: selectedTab.id, preventDefault: () => { defaultPrevented = true; } });

      if (!defaultPrevented || force) {
        const previousTab = this._getTabById(this.activeId);
        if (previousTab && previousTab.load === 'activeOnly' && previousTab.loaded) {
          // unload tab content when tab desires to be loaded as activeOnly
          previousTab.loaded = false;
        }
        this.activeId = selectedTab.id;
        selectedTab.loaded = true;
        if (this.enableRouting) {
          this.isSelecting = true;
          setTimeout(() => {
            this.router.navigate([{ tab: selectedTab.id }], { relativeTo: this.route.parent })
              .then(() => this.isSelecting = false)
              .catch(() => this.isSelecting = false);
          });
        }
      }
    }
  }

  scrollLeft() {
    this.elUL.scrollBy({ behavior: 'smooth', left: SCROLL_BY });
  }

  scrollRight() {
    this.elUL.scrollBy({ behavior: 'smooth', left: - SCROLL_BY });
  }

  startScrollRight() {
    this._scrollSub = interval(100).subscribe(() => {
      this.elUL.scrollBy({ behavior: 'smooth', left: - SCROLL_BY });
    });
  }

  startScrollLeft() {
    this._scrollSub = interval(100).subscribe(() => {
      this.elUL.scrollBy({ behavior: 'smooth', left: SCROLL_BY });
    });
  }

  stopScroll() {
    if (this._scrollSub) {
      this._scrollSub.unsubscribe();
    }
  }


  updateValidityIndication() {
    this._updateValidity$.next();
  }

  private updateScrollBtnVisibility() {
    if (!this.elUL) {
      return;
    }

    if (this.elUL.scrollLeft === 0) {
      this.renderer.removeStyle(this.elBtnLeft, 'display');
      this.stopScroll();
    } else {
      this.renderer.setStyle(this.elBtnLeft, 'display', 'flex');
      this.renderer.setStyle(this.elBtnLeft, 'height', `${this.elUL.clientHeight}px`);
    }
    // safari somehow sometimes calculates scrollWidth + clientWidth not equaly
    // even when it should be same
    const scrollDiff = this.elUL.scrollWidth - this.elUL.clientWidth;
    const diff2 = this.elUL.scrollLeft - scrollDiff;
    const hideRight = diff2 === 0 || diff2 === 1;
    //console.log(this.elUL.scrollLeft, scrollDiff, diff2)
    if (hideRight) {
      this.renderer.removeStyle(this.elBtnRight, 'display');
      this.stopScroll();
    } else {
      this.renderer.setStyle(this.elBtnRight, 'display', 'flex');
      this.renderer.setStyle(this.elBtnRight, 'height', `${this.elUL.clientHeight}px`);
    }
  }

  private _getTabById(id: string): IsTabDirective {
    const tabsWithId: IsTabDirective[] = this.tabs.filter(tab => tab.id === id);
    return tabsWithId.length ? tabsWithId[0] : null;
  }
}
