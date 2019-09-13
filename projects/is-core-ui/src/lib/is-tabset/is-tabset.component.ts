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
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  @ContentChild(IsTabContentDirective,  {static: true}) contentTpl: IsTabContentDirective;
  @ContentChild(IsTabTitleDirective, {static: true}) titleTpl: IsTabTitleDirective;

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
  template: `
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" *ngFor="let tab of tabs" [class.active]="tab.id === activeId" [class.disabled]="tab.disabled">
        <a [id]="tab.id" class="nav-link {{tab.titleClass}}" [class.active]="tab.id === activeId" (click)="select(tab.id)">
          {{tab.title}}<ng-template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></ng-template>
        </a>
      </li>
    </ul>
    <div class="tab-content" *ngIf="tabs.length > 0">
      <ng-template ngFor let-tab [ngForOf]="tabs">
        <div class="tab-pane" [class.active]="tab.id === activeId" *ngIf="tab.loaded || tab.id === activeId" role="tabpanel" [attr.aria-labelledby]="tab.id">
          <ng-template [ngTemplateOutlet]="tab.contentTpl.templateRef"></ng-template>
        </div>
      </ng-template>
    </div>
  `,
})
export class IsTabsetComponent implements AfterContentChecked, AfterContentInit {
  @ContentChildren(IsTabDirective) tabs: QueryList<IsTabDirective>;

  /**
   * An identifier of an initially selected (active) tab. Use the "select" method to switch a tab programmatically.
   */
  @Input() activeId: string;

  @Input() enableRouting: boolean;

  /**
   * A tab change event fired right before the tab selection happens. See NgbTabChangeEvent for payload details
   */
  @Output() tabChange = new EventEmitter<TabChangeEvent>();
  private isSelecting: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {

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

  private _getTabById(id: string): IsTabDirective {
    const tabsWithId: IsTabDirective[] = this.tabs.filter(tab => tab.id === id);
    return tabsWithId.length ? tabsWithId[0] : null;
  }
}
