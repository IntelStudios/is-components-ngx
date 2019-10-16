import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, fromEvent, merge } from 'rxjs';

let nextId = 0;

/* tslint:disable */


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
   * set wheather tab content should be lazy-loaded or not. Default is false,
   * so tab's content is immediately rendered. If set to `true` tab's content
   * is loaded when selected for the 1st time
   */
  @Input() load: 'always' | 'activeOnly' | 'selected' = 'always';

  @ContentChild(IsTabContentDirective, { static: true }) contentTpl: IsTabContentDirective;
  @ContentChild(IsTabTitleDirective, { static: true }) titleTpl: IsTabTitleDirective;

  loaded: boolean = false;
}
/* tslint:enable */

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
 * A component that makes it easy to create tabbed interface.
 */
@Component({
  selector: 'is-tabset',
  styleUrls: ['is-tabset.component.scss'],
  template: `
    <ul class="nav nav-tabs" role="tablist" [class.stretched]="stretched">
      <li class="nav-item" *ngFor="let tab of tabs" [class.disabled]="tab.disabled">
        <a [id]="tab.id" class="nav-link {{tab.titleClass}}" [ngClass]="{'active show' : tab.id === activeId}" (click)="select(tab.id)">
          {{tab.title}}<ng-template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></ng-template>
        </a>
      </li>
    </ul>

    <div class="scroll-btn left"><i class="fas fa-chevron-left" (click)="scrollTabRight()"></i></div>
    <div class="scroll-btn right"><i class="fas fa-chevron-right" (click)="scrollTabLeft()"></i></div>

    <div class="tab-content" *ngIf="tabs.length > 0">
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
   * Enable / disable tab wrap feature. If enabled, tab titles will remain in a single row with
   * scroll. If disabled, tab titles will wrap.
   */
  @Input() nowrap: boolean = true;

  /**
   * A tab change event fired right before the tab selection happens. See NgbTabChangeEvent for payload details
   */
  @Output() tabChange = new EventEmitter<TabChangeEvent>();

  @ContentChildren(IsTabDirective) tabs: QueryList<IsTabDirective>;

  private isSelecting: boolean = false;

  private elUL: HTMLUListElement;

  private elBtnLeft: HTMLDivElement;
  private elBtnRight: HTMLDivElement;

  private _sub: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private el: ElementRef, private renderer: Renderer2) {

  }

  ngOnInit() {

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
    }
  }

  ngOnDestroy() {
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
      if (!t.loaded) {
        t.loaded = t.load === 'always';
      } else {
        t.loaded = t.load !== 'activeOnly';
      }
    });
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

  scrollTabRight() {
    this.elUL.scrollBy({ behavior: 'smooth', left: -50 });
  }

  scrollTabLeft() {
    this.elUL.scrollBy({ behavior: 'smooth', left: 50 });
  }

  private updateScrollBtnVisibility() {
    if (!this.elUL) {
      return;
    }

    if (this.elUL.scrollLeft === 0) {
      this.renderer.removeStyle(this.elBtnLeft, 'display');
    } else {
      this.renderer.setStyle(this.elBtnLeft, 'display', 'flex');
      this.renderer.setStyle(this.elBtnLeft, 'height', `${this.elUL.clientHeight}px`);
    }

    if (this.elUL.scrollLeft === this.elUL.scrollWidth - this.elUL.clientWidth) {
      this.renderer.removeStyle(this.elBtnRight, 'display');
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
