import {
  Component,
  ContentChild,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  afterRenderEffect,
  computed,
  contentChildren,
  inject,
  input,
  linkedSignal,
  signal,
  TemplateRef,
  HostBinding,
  ChangeDetectionStrategy
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
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

export type IsTabsetScrollableMode = 'none' | 'sticky-headers' | 'scrollable-tabcontent';

interface ActiveTabSource {
  tabs: readonly IsTabDirective[];
  id: string;
  requested: IsTabDirective;
}

/**
 * This directive should be used to render invalid content, which appears
 * when there is an invalid tab not visible by user because of wrap feature
 */
@Directive({
    selector: 'ng-template[TabsetInvalid]',
})
export class IsTabsetInvalidDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

/**
 * This directive should be used to wrap tab titles that need to contain HTML markup or other directives.
 */
@Directive({
    selector: 'ng-template[TabTitle]',
})
export class IsTabTitleDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}


@Directive({
    selector: 'ng-template[TabsetAfterNavItems]',
})
export class IsTabsetAfterNavItemsDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
@Directive({
    selector: 'ng-template[TabContent]',
})
export class IsTabContentDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

/**
 * A directive representing an individual tab.
 */
@Directive({
    selector: 'is-tab',
})
export class IsTabDirective {
  /**
   * Unique tab identifier. Must be unique for the entire document for proper accessibility support.
   */
  readonly id = input<string>(`is-tab-${nextId++}`);
  /**
   * Simple (string only) title. Use the "NgbTabTitle" directive for more complex use-cases.
   */
  readonly title = input<string>();

  readonly titleClass = input('');
  /**
   * Allows toggling disabled state of a given state. Disabled tabs can't be selected.
   */
  readonly disabled = input(false);

  readonly paneClass = input('');

  /**
   * Valid/invalid tab incidation. This allows to incidate invalid tab in tabset
   * which is not visible to user (because of wrap being enabled)
   */
  readonly valid = input(true);
  /**
   * always - content is rendered immediately and stays rendered
   * selected - content is rendered when the tab is selected for the 1st time and then stays rendered
   * activeOnly - content is rendered only while the tab is active
   */
  readonly load = input<'always' | 'activeOnly' | 'selected'>('always');

  @ContentChild(IsTabContentDirective, { static: true }) contentTpl: IsTabContentDirective;
  @ContentChild(IsTabTitleDirective, { static: true }) titleTpl: IsTabTitleDirective;
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
        @for (tab of tabs(); track tab.id()) {
          <li class="nav-item" [class.disabled]="tab.disabled()" [class.is-tab-invalid]="tab.valid() === false">
            <a [id]="tab.id()" class="nav-link" [class]="tab.titleClass()" [class.active]="tab === activeTab()" [class.show]="tab === activeTab()" (click)="select(tab.id())">
              {{tab.title()}}<ng-template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></ng-template>
            </a>
          </li>
        }
        <ng-container [ngTemplateOutlet]="tabsetAfterNavItemsTemplate?.templateRef"></ng-container>
      </ul>
      <div class="scroll-btn left"><i class="fas fa-chevron-left" (click)="scrollRight()" (mousedown)="startScrollRight()" (mouseup)="stopScroll()"></i></div>
      <div class="scroll-btn right"><i class="fas fa-chevron-right" (click)="scrollLeft()" (mousedown)="startScrollLeft()" (mouseup)="stopScroll()"></i></div>
    </div>
    
    @if (tabsetInvalidLeft()) {
      <div class="tabset-invalid left">
        <ng-container [ngTemplateOutlet]="tabsetInvalidTemplate?.templateRef || defaultInvalidTemplate">
        </ng-container>
      </div>
    }
    @if (tabsetInvalidRight()) {
      <div class="tabset-invalid right">
        <ng-container [ngTemplateOutlet]="tabsetInvalidTemplate?.templateRef || defaultInvalidTemplate">
        </ng-container>
      </div>
    }
    <ng-template #defaultInvalidTemplate>
      <i class="fas fa-exclamation"></i>
    </ng-template>
    @if (tabs().length > 0) {
      <div class="tab-content" [class.pills]="pills" cdkScrollable>
        @for (tab of tabs(); track tab.id()) {
          @if (renderedTabs().has(tab)) {
            <div class="tab-pane" [class]="tab.paneClass()" [class.active]="tab === activeTab()" [class.show]="tab === activeTab()" role="tabpanel" [attr.aria-labelledby]="tab.id()">
              <ng-template [ngTemplateOutlet]="tab.contentTpl.templateRef"></ng-template>
            </div>
          }
        }
      </div>
    }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet, CdkScrollable],
})
export class IsTabsetComponent implements OnInit, OnDestroy {
  /**
   * An identifier of an initially selected (active) tab. Use the "select" method to switch a tab programmatically.
   * Reading returns the id of the tab that is actually shown (the first tab when the requested id does not exist).
   */
  @Input()
  set activeId(id: string) {
    this.selectedId.set(id);
  }
  get activeId(): string {
    return this.activeTab()?.id();
  }

  /**
   * Sets stretched display behavior. If Enabled, tab titless will stretch to max available space. If disabled
   * tab titles will go from right to left
   */
  @Input() stretched = false;

  /**
   * Integrate with angular router. Tab IDs are represented
   * as #fragments in route
   */
  @Input() useRouter = false;

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
   scrollableMode: IsTabsetScrollableMode = 'none';

  /**
   * A tab change event fired right before the tab selection happens. See NgbTabChangeEvent for payload details
   */
  @Output() tabChange = new EventEmitter<TabChangeEvent>();

  /**
   * OnPush skips a ContentChildren query, so added or removed is-tab nodes never redraw.
   * Reading this signal in the template subscribes to that list and schedules a check.
   */
  readonly tabs = contentChildren(IsTabDirective, { descendants: false });

  private readonly selectedId = signal<string>(undefined);

  /**
   * The requested tab when it exists. Otherwise the current tab stays active while it exists,
   * so added or reordered tabs do not move the selection; a new request that matches nothing
   * and a removed active tab both fall back to the first tab.
   */
  private readonly _activeTab = linkedSignal<ActiveTabSource, IsTabDirective>({
    source: () => {
      const tabs = this.tabs();
      const id = this.selectedId();
      return { tabs, id, requested: tabs.find(tab => tab.id() === id) };
    },
    computation: ({ tabs, id, requested }, previous) => {
      if (requested) {
        return requested;
      }
      const current = previous?.value;
      const sameRequest = previous?.source.id === id;
      return sameRequest && current && tabs.includes(current) ? current : tabs[0] ?? null;
    },
  });

  readonly activeTab = this._activeTab.asReadonly();

  /**
   * Every tab that has been active, so `load: 'selected'` content stays rendered after leaving it.
   * Tabs that were active only between two renders are not recorded; their content was never shown.
   */
  private readonly visitedTabs = linkedSignal<IsTabDirective, ReadonlySet<IsTabDirective>>({
    source: this.activeTab,
    computation: (active, previous) => {
      const visited = new Set(previous?.value);
      if (active) {
        visited.add(active);
      }
      return visited;
    },
  });

  readonly renderedTabs = computed(() => {
    const active = this.activeTab();
    const visited = this.visitedTabs();
    return new Set(this.tabs().filter(tab =>
      tab === active || tab.load() === 'always' || (tab.load() === 'selected' && visited.has(tab))));
  });

  @ContentChild(IsTabsetInvalidDirective, { static: true })
  tabsetInvalidTemplate: IsTabsetInvalidDirective;

  @ContentChild(IsTabsetAfterNavItemsDirective, { static: true })
  tabsetAfterNavItemsTemplate: IsTabsetAfterNavItemsDirective;

  readonly tabsetInvalidLeft = signal(false);
  readonly tabsetInvalidRight = signal(false);


  private isSelecting: boolean = false;

  private elUL: HTMLUListElement;

  private elBtnLeft: HTMLDivElement;
  private elBtnRight: HTMLDivElement;

  private _sub: Subscription;
  private _scrollSub: Subscription;
  private _updateValidity$: Subject<any> = new Subject();
  private _updateValiditySub: Subscription;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterRenderEffect(() => {
      this.activeTab();
      for (const tab of this.tabs()) {
        tab.valid();
      }
      this.scrollToActiveTab();
      this.updateScrollBtnVisibility();
      this.updateValidityIndication();
    });
  }

  ngOnInit() {
    if (this.scrollableMode && this.scrollableMode != 'none') {
      this.el.nativeElement.classList.add(this.scrollableMode);
    }

    if (this.useRouter) {
      this.route.fragment
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((fragment) => {
          if (!fragment) {
            return;
          }
          if (this._getTabById(fragment)) {
            this.select(fragment);
          } else {
            // the tab may not be rendered yet; activeTab switches to it once it appears
            this.selectedId.set(fragment);
          }
        });
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

          this.tabsetInvalidRight.set(false);
          this.tabsetInvalidLeft.set(false);
          tabs.forEach(t => {
            const rect = t.getBoundingClientRect();
            if (rect.left < ulRect.left) {
              this.tabsetInvalidLeft.set(true);
            }
            if (rect.left + (rect.width - 1) > width) {
              this.tabsetInvalidRight.set(true);
            }
          });
        });
    }
  }

  ngOnDestroy() {
    this._updateValiditySub?.unsubscribe();
    this._sub?.unsubscribe();
    this.stopScroll();
  }

  /**
   * Selects the tab with the given id and shows its associated pane.
   * Any other tab that was previously selected becomes unselected and its associated pane is hidden.
   */
  select(tabId: string, force = false) {
    if (this.isSelecting) {
      return;
    }
    const selectedTab = this._getTabById(tabId);
    const currentTab = this.activeTab();
    if (!selectedTab || (!force && (selectedTab.disabled() || selectedTab === currentTab))) {
      return;
    }

    let defaultPrevented = false;
    this.tabChange.emit(
      { forced: force, activeId: currentTab?.id(), nextId: selectedTab.id(), preventDefault: () => { defaultPrevented = true; } });
    if (defaultPrevented && !force) {
      return;
    }

    this.selectedId.set(selectedTab.id());
    if (this.useRouter) {
      this.isSelecting = true;
      const done = () => { this.isSelecting = false; };
      this.router.navigate([], { fragment: selectedTab.id() }).then(done, done);
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
    this._updateValidity$.next(undefined);
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
    return this.tabs().find(tab => tab.id() === id) ?? null;
  }

  /**
   * Scrolls to the active tab
   */
  scrollToActiveTab() {
    if (!this.elUL) {
      return;
    }
    const activeTab = this.elUL.querySelector(`[id="${this.activeId}"]`);
    if (activeTab) {
      const tabRect = activeTab.getBoundingClientRect();
      const ulRect = this.elUL.getBoundingClientRect();
      
      if (tabRect.left < ulRect.left) {
        this.elUL.scrollBy({ behavior: 'smooth', left: tabRect.left - ulRect.left + 20 });
      } else if (tabRect.right > ulRect.right) {
        this.elUL.scrollBy({ behavior: 'smooth', left: tabRect.right - ulRect.right + 20 });
      }
    }
  }
}
