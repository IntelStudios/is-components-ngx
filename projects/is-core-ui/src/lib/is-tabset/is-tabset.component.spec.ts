import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import {
  IsTabContentDirective,
  IsTabDirective,
  IsTabsetAfterNavItemsDirective,
  IsTabsetComponent,
  IsTabsetInvalidDirective,
  IsTabTitleDirective,
  TabChangeEvent,
} from './is-tabset.component';

type TabLoad = 'always' | 'activeOnly' | 'selected';

interface TabDef {
  id: string;
  title?: string;
  load?: TabLoad;
  disabled?: boolean;
  valid?: boolean;
  titleClass?: string;
  paneClass?: string;
}

/**
 * Tabs come from a @for over a signal, like request forms do. All tab inputs are bound,
 * so they are applied in the embedded view update pass, not at creation.
 */
@Component({
  imports: [IsTabsetComponent, IsTabDirective, IsTabContentDirective],
  template: `
    <div [style.width.px]="width()">
      <is-tabset
        [activeId]="activeId()"
        [pills]="pills()"
        [stretched]="stretched()"
        [nowrap]="nowrap()"
        [useRouter]="useRouter()"
        [scrollableMode]="scrollableMode()"
        (tabChange)="onTabChange($event)">
        @for (tab of tabs(); track tab.id) {
          <is-tab
            [id]="tab.id"
            [title]="tab.title ?? tab.id"
            [load]="tab.load ?? 'always'"
            [disabled]="tab.disabled ?? false"
            [valid]="tab.valid ?? true"
            [titleClass]="tab.titleClass ?? ''"
            [paneClass]="tab.paneClass ?? ''">
            <ng-template TabContent>
              <span [class]="'content-' + tab.id">{{ tab.id }} content</span>
            </ng-template>
          </is-tab>
        }
      </is-tabset>
    </div>
  `,
})
class ForHostComponent {
  readonly tabset = viewChild.required(IsTabsetComponent);

  readonly tabs = signal<TabDef[]>([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
  readonly activeId = signal<string>(undefined);
  readonly pills = signal(false);
  readonly stretched = signal(false);
  readonly nowrap = signal(true);
  readonly useRouter = signal(false);
  readonly scrollableMode = signal<'none' | 'sticky-headers' | 'scrollable-tabcontent'>('none');
  readonly width = signal<number>(undefined);

  readonly events: TabChangeEvent[] = [];
  preventChange = false;

  onTabChange(event: TabChangeEvent) {
    this.events.push(event);
    if (this.preventChange) {
      event.preventDefault();
    }
  }
}

/**
 * Static markup with optional templates and plain attributes, like most hand-written tabsets.
 */
@Component({
  imports: [
    IsTabsetComponent,
    IsTabDirective,
    IsTabContentDirective,
    IsTabTitleDirective,
    IsTabsetAfterNavItemsDirective,
  ],
  template: `
    <is-tabset activeId="second">
      <ng-template TabsetAfterNavItems><li class="after-nav-items">extra</li></ng-template>
      <is-tab id="first" title="First" titleClass="first-title" paneClass="first-pane">
        <ng-template TabContent><span class="content-first">first</span></ng-template>
      </is-tab>
      <is-tab id="second" load="selected">
        <ng-template TabTitle><b class="custom-title">Second</b></ng-template>
        <ng-template TabContent><span class="content-second">second</span></ng-template>
      </is-tab>
      @if (showThird()) {
        <is-tab id="third" load="activeOnly">
          <ng-template TabContent><span class="content-third">third</span></ng-template>
        </is-tab>
      }
    </is-tabset>
  `,
})
class StaticHostComponent {
  readonly tabset = viewChild.required(IsTabsetComponent);
  readonly showThird = signal(false);
}

/**
 * Nested tabsets: the outer one must not pick up tabs of the inner one.
 */
@Component({
  imports: [IsTabsetComponent, IsTabDirective, IsTabContentDirective],
  template: `
    <is-tabset class="outer">
      <is-tab id="outer-1">
        <ng-template TabContent>
          <is-tabset class="inner">
            <is-tab id="inner-1"><ng-template TabContent>inner 1</ng-template></is-tab>
            <is-tab id="inner-2"><ng-template TabContent>inner 2</ng-template></is-tab>
          </is-tabset>
        </ng-template>
      </is-tab>
      <is-tab id="outer-2"><ng-template TabContent>outer 2</ng-template></is-tab>
    </is-tabset>
  `,
})
class NestedHostComponent {}

/**
 * Narrow tabset with a custom TabsetInvalid template and the last tab invalid.
 */
@Component({
  imports: [IsTabsetComponent, IsTabDirective, IsTabContentDirective, IsTabsetInvalidDirective],
  template: `
    <div style="width: 300px">
      <is-tabset>
        <ng-template TabsetInvalid><i class="custom-invalid"></i></ng-template>
        @for (i of ids; track i) {
          <is-tab [id]="'t' + i" [title]="'A rather long tab title ' + i" [valid]="i !== 11">
            <ng-template TabContent>{{ i }}</ng-template>
          </is-tab>
        }
      </is-tabset>
    </div>
  `,
})
class InvalidTemplateHostComponent {
  readonly ids = Array.from({ length: 12 }, (_, i) => i);
}

async function settle(fixture: ComponentFixture<unknown>) {
  fixture.detectChanges();
  await fixture.whenStable();
}

function el(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

function headerIds(fixture: ComponentFixture<unknown>): string[] {
  return Array.from(el(fixture).querySelectorAll('.tab-header .nav-link')).map(link => link.id);
}

function activeHeaderIds(fixture: ComponentFixture<unknown>): string[] {
  return Array.from(el(fixture).querySelectorAll('.tab-header .nav-link.active')).map(link => link.id);
}

function activePaneLabel(fixture: ComponentFixture<unknown>): string {
  return el(fixture).querySelector('.tab-pane.active')?.getAttribute('aria-labelledby');
}

function content(fixture: ComponentFixture<unknown>, id: string): HTMLElement {
  return el(fixture).querySelector(`.content-${id}`);
}

function clickHeader(fixture: ComponentFixture<unknown>, id: string) {
  (el(fixture).querySelector(`.tab-header .nav-link[id="${id}"]`) as HTMLElement).click();
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('IsTabsetComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForHostComponent, StaticHostComponent, NestedHostComponent, InvalidTemplateHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  describe('rendering', () => {
    let fixture: ComponentFixture<ForHostComponent>;
    let host: ForHostComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(ForHostComponent);
      host = fixture.componentInstance;
      await settle(fixture);
    });

    it('renders one header per tab in order, with titles', () => {
      expect(headerIds(fixture)).toEqual(['a', 'b', 'c']);
      const titles = Array.from(el(fixture).querySelectorAll('.tab-header .nav-link')).map(l => l.textContent.trim());
      expect(titles).toEqual(['a', 'b', 'c']);
    });

    it('activates the first tab when no activeId is given', () => {
      expect(activeHeaderIds(fixture)).toEqual(['a']);
      expect(activePaneLabel(fixture)).toBe('a');
      expect(host.tabset().activeId).toBe('a');
      expect(host.tabset().activeTab().id()).toBe('a');
    });

    it('applies titleClass and paneClass changed at runtime without dropping own classes', async () => {
      host.tabs.set([{ id: 'a', titleClass: 'my-title', paneClass: 'my-pane' }, { id: 'b' }]);
      await settle(fixture);

      const link = el(fixture).querySelector('.nav-link[id="a"]');
      const pane = el(fixture).querySelector('[role="tabpanel"][aria-labelledby="a"]');
      expect(Array.from(link.classList)).toEqual(expect.arrayContaining(['nav-link', 'my-title', 'active', 'show']));
      expect(Array.from(pane.classList)).toEqual(expect.arrayContaining(['tab-pane', 'my-pane', 'active', 'show']));

      host.tabs.set([{ id: 'a', titleClass: 'other-title', paneClass: 'other-pane' }, { id: 'b' }]);
      await settle(fixture);
      expect(Array.from(link.classList)).toEqual(expect.arrayContaining(['nav-link', 'other-title', 'active', 'show']));
      expect(link.classList).not.toContain('my-title');
      expect(Array.from(pane.classList)).toEqual(expect.arrayContaining(['tab-pane', 'other-pane', 'active', 'show']));
      expect(pane.classList).not.toContain('my-pane');

      host.tabset().select('b');
      await settle(fixture);
      expect(link.classList).not.toContain('active');
      expect(Array.from(link.classList)).toEqual(expect.arrayContaining(['nav-link', 'other-title']));
      expect(pane.classList).not.toContain('active');
      expect(Array.from(pane.classList)).toEqual(expect.arrayContaining(['tab-pane', 'other-pane']));
    });

    it('marks disabled and invalid tabs in the header', async () => {
      host.tabs.set([{ id: 'a' }, { id: 'b', disabled: true }, { id: 'c', valid: false }]);
      await settle(fixture);

      const items = el(fixture).querySelectorAll('.tab-header .nav-item');
      expect(items[1].classList).toContain('disabled');
      expect(items[2].classList).toContain('is-tab-invalid');
      expect(items[0].classList).not.toContain('disabled');
      expect(items[0].classList).not.toContain('is-tab-invalid');
    });

    it('switches between tabs and pills style', async () => {
      const ul = () => el(fixture).querySelector('.tab-header ul');
      expect(ul().className).toContain('nav-tabs');

      host.pills.set(true);
      await settle(fixture);
      expect(ul().className).toContain('nav-pills');
      expect(el(fixture).querySelector('.tab-content').classList).toContain('pills');
    });

    it('applies the stretched class', async () => {
      host.stretched.set(true);
      await settle(fixture);
      expect(el(fixture).querySelector('.tab-header ul').classList).toContain('stretched');
    });

    it('renders no tab content container without tabs', async () => {
      host.tabs.set([]);
      await settle(fixture);

      expect(headerIds(fixture)).toEqual([]);
      expect(el(fixture).querySelector('.tab-content')).toBeNull();
      expect(host.tabset().activeId).toBeUndefined();
    });
  });

  describe('scrollableMode', () => {
    it('adds the mode as a host class', async () => {
      const fixture = TestBed.createComponent(ForHostComponent);
      fixture.componentInstance.scrollableMode.set('sticky-headers');
      await settle(fixture);

      expect(el(fixture).querySelector('is-tabset').classList).toContain('sticky-headers');
    });

    it('adds no class for none', async () => {
      const fixture = TestBed.createComponent(ForHostComponent);
      await settle(fixture);

      expect(el(fixture).querySelector('is-tabset').classList).not.toContain('none');
    });
  });

  describe('activeId', () => {
    let fixture: ComponentFixture<ForHostComponent>;
    let host: ForHostComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(ForHostComponent);
      host = fixture.componentInstance;
    });

    it('activates the tab from the input', async () => {
      host.activeId.set('b');
      await settle(fixture);

      expect(activeHeaderIds(fixture)).toEqual(['b']);
      expect(host.tabset().activeId).toBe('b');
    });

    it('falls back to the first tab when the id does not exist', async () => {
      host.activeId.set('missing');
      await settle(fixture);

      expect(activeHeaderIds(fixture)).toEqual(['a']);
      expect(host.tabset().activeId).toBe('a');
    });

    it('follows later input changes, including ones the tab list did not trigger', async () => {
      await settle(fixture);

      host.activeId.set('c');
      await settle(fixture);
      expect(activeHeaderIds(fixture)).toEqual(['c']);

      host.activeId.set('missing');
      await settle(fixture);
      expect(activeHeaderIds(fixture)).toEqual(['a']);
    });

    it('activates the requested tab once it appears', async () => {
      host.activeId.set('d');
      await settle(fixture);
      expect(activeHeaderIds(fixture)).toEqual(['a']);

      host.tabs.update(tabs => [...tabs, { id: 'd' }]);
      await settle(fixture);
      expect(activeHeaderIds(fixture)).toEqual(['d']);
    });

    it('does not emit tabChange when the input changes', async () => {
      await settle(fixture);
      host.activeId.set('b');
      await settle(fixture);

      expect(host.events).toEqual([]);
    });

    it('keeps exactly one tab active', async () => {
      host.activeId.set('b');
      await settle(fixture);
      clickHeader(fixture, 'c');
      await settle(fixture);

      expect(activeHeaderIds(fixture)).toEqual(['c']);
      expect(el(fixture).querySelectorAll('.tab-pane.active').length).toBe(1);
    });
  });

  describe('select', () => {
    let fixture: ComponentFixture<ForHostComponent>;
    let host: ForHostComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(ForHostComponent);
      host = fixture.componentInstance;
      await settle(fixture);
    });

    it('selects a tab by header click and emits tabChange', async () => {
      clickHeader(fixture, 'b');
      await settle(fixture);

      expect(activeHeaderIds(fixture)).toEqual(['b']);
      expect(activePaneLabel(fixture)).toBe('b');
      expect(host.events.length).toBe(1);
      expect(host.events[0]).toEqual(expect.objectContaining({ activeId: 'a', nextId: 'b', forced: false }));
    });

    it('selects a tab programmatically', async () => {
      host.tabset().select('c');
      await settle(fixture);

      expect(activeHeaderIds(fixture)).toEqual(['c']);
      expect(host.tabset().activeId).toBe('c');
    });

    it('keeps the selection when the parent re-renders with an unchanged activeId', async () => {
      host.tabset().select('c');
      await settle(fixture);
      host.pills.set(true);
      await settle(fixture);

      expect(activeHeaderIds(fixture)).toEqual(['c']);
    });

    it('does nothing when the tab is already active', async () => {
      host.tabset().select('a');
      await settle(fixture);

      expect(host.events).toEqual([]);
    });

    it('does nothing for an unknown tab, even when forced', async () => {
      host.tabset().select('missing');
      host.tabset().select('missing', true);
      await settle(fixture);

      expect(host.events).toEqual([]);
      expect(activeHeaderIds(fixture)).toEqual(['a']);
    });

    it('ignores disabled tabs unless forced', async () => {
      host.tabs.set([{ id: 'a' }, { id: 'b', disabled: true }]);
      await settle(fixture);

      clickHeader(fixture, 'b');
      await settle(fixture);
      expect(activeHeaderIds(fixture)).toEqual(['a']);
      expect(host.events).toEqual([]);

      host.tabset().select('b', true);
      await settle(fixture);
      expect(activeHeaderIds(fixture)).toEqual(['b']);
      expect(host.events[0]).toEqual(expect.objectContaining({ nextId: 'b', forced: true }));
    });

    it('keeps the current tab when tabChange is prevented', async () => {
      host.preventChange = true;
      clickHeader(fixture, 'b');
      await settle(fixture);

      expect(host.events.length).toBe(1);
      expect(activeHeaderIds(fixture)).toEqual(['a']);
    });

    it('switches anyway when forced, even if prevented', async () => {
      host.preventChange = true;
      host.tabset().select('b', true);
      await settle(fixture);

      expect(activeHeaderIds(fixture)).toEqual(['b']);
    });

    it('re-emits for the active tab when forced', async () => {
      host.tabset().select('a', true);
      await settle(fixture);

      expect(host.events[0]).toEqual(expect.objectContaining({ activeId: 'a', nextId: 'a', forced: true }));
    });
  });

  describe('load modes', () => {
    let fixture: ComponentFixture<ForHostComponent>;
    let host: ForHostComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(ForHostComponent);
      host = fixture.componentInstance;
    });

    it('always: renders every tab content immediately', async () => {
      await settle(fixture);

      expect(content(fixture, 'a')).not.toBeNull();
      expect(content(fixture, 'b')).not.toBeNull();
      expect(content(fixture, 'c')).not.toBeNull();
    });

    it('selected: renders content on first selection and keeps it afterwards', async () => {
      host.tabs.set([{ id: 'a' }, { id: 'b', load: 'selected' }]);
      await settle(fixture);
      expect(content(fixture, 'b')).toBeNull();

      host.tabset().select('b');
      await settle(fixture);
      const rendered = content(fixture, 'b');
      expect(rendered).not.toBeNull();

      host.tabset().select('a');
      await settle(fixture);
      expect(content(fixture, 'b')).toBe(rendered);
    });

    it('selected: keeps content after the parent switches activeId away', async () => {
      host.tabs.set([{ id: 'a' }, { id: 'b', load: 'selected' }]);
      host.activeId.set('b');
      await settle(fixture);
      const rendered = content(fixture, 'b');
      expect(rendered).not.toBeNull();

      host.activeId.set('a');
      await settle(fixture);
      expect(content(fixture, 'b')).toBe(rendered);
    });

    it('selected: a first tab activated by fallback counts as selected', async () => {
      host.tabs.set([{ id: 'a', load: 'selected' }, { id: 'b' }]);
      await settle(fixture);
      expect(content(fixture, 'a')).not.toBeNull();

      host.tabset().select('b');
      await settle(fixture);
      expect(content(fixture, 'a')).not.toBeNull();
    });

    it('activeOnly: renders content only while active and recreates it', async () => {
      host.tabs.set([{ id: 'a' }, { id: 'b', load: 'activeOnly' }]);
      await settle(fixture);
      expect(content(fixture, 'b')).toBeNull();

      host.tabset().select('b');
      await settle(fixture);
      const first = content(fixture, 'b');
      expect(first).not.toBeNull();

      host.tabset().select('a');
      await settle(fixture);
      expect(content(fixture, 'b')).toBeNull();

      host.tabset().select('b');
      await settle(fixture);
      expect(content(fixture, 'b')).not.toBeNull();
      expect(content(fixture, 'b')).not.toBe(first);
    });

    it('uses the bound load of tabs added later', async () => {
      await settle(fixture);
      host.tabs.update(tabs => [...tabs, { id: 'd', load: 'selected' }, { id: 'e', load: 'activeOnly' }]);
      await settle(fixture);

      expect(headerIds(fixture)).toEqual(['a', 'b', 'c', 'd', 'e']);
      expect(content(fixture, 'd')).toBeNull();
      expect(content(fixture, 'e')).toBeNull();
    });
  });

  describe('dynamic tabs', () => {
    let fixture: ComponentFixture<ForHostComponent>;
    let host: ForHostComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(ForHostComponent);
      host = fixture.componentInstance;
      await settle(fixture);
    });

    it('shows added tabs without recreating the tabset', async () => {
      const tabset = host.tabset();
      host.tabs.update(tabs => [...tabs, { id: 'd' }]);
      await settle(fixture);

      expect(host.tabset()).toBe(tabset);
      expect(headerIds(fixture)).toEqual(['a', 'b', 'c', 'd']);
      expect(content(fixture, 'd')).not.toBeNull();
    });

    it('drops removed tabs from header and content', async () => {
      host.tabs.set([{ id: 'a' }, { id: 'c' }]);
      await settle(fixture);

      expect(headerIds(fixture)).toEqual(['a', 'c']);
      expect(content(fixture, 'b')).toBeNull();
    });

    it('keeps the implicitly active tab when tabs are reordered', async () => {
      host.tabs.set([{ id: 'c' }, { id: 'a' }, { id: 'b' }]);
      await settle(fixture);

      expect(headerIds(fixture)).toEqual(['c', 'a', 'b']);
      expect(activeHeaderIds(fixture)).toEqual(['a']);
    });

    it('keeps the implicitly active tab when a tab is inserted in front', async () => {
      host.tabs.update(tabs => [{ id: 'z' }, ...tabs]);
      await settle(fixture);

      expect(headerIds(fixture)).toEqual(['z', 'a', 'b', 'c']);
      expect(activeHeaderIds(fixture)).toEqual(['a']);
      expect(host.events).toEqual([]);
    });

    it('keeps the implicitly active tab when its id is used by a new request that matches nothing', async () => {
      host.activeId.set('missing');
      await settle(fixture);
      host.tabs.update(tabs => [{ id: 'z' }, ...tabs]);
      await settle(fixture);

      expect(activeHeaderIds(fixture)).toEqual(['a']);
    });

    it('falls back to the first tab when the active tab is removed', async () => {
      host.tabset().select('b');
      await settle(fixture);

      host.tabs.set([{ id: 'a' }, { id: 'c' }]);
      await settle(fixture);
      expect(activeHeaderIds(fixture)).toEqual(['a']);
    });

    it('returns to the selected tab when it comes back', async () => {
      host.tabset().select('b');
      await settle(fixture);

      host.tabs.set([{ id: 'a' }, { id: 'c' }]);
      await settle(fixture);
      host.tabs.set([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
      await settle(fixture);

      expect(activeHeaderIds(fixture)).toEqual(['b']);
    });

    it('updates titles and validity of existing tabs', async () => {
      host.tabs.set([{ id: 'a', title: 'Renamed' }, { id: 'b', valid: false }, { id: 'c' }]);
      await settle(fixture);

      expect(el(fixture).querySelector('.nav-link[id="a"]').textContent.trim()).toBe('Renamed');
      expect(el(fixture).querySelectorAll('.tab-header .nav-item')[1].classList).toContain('is-tab-invalid');
    });
  });

  describe('static markup', () => {
    let fixture: ComponentFixture<StaticHostComponent>;
    let host: StaticHostComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(StaticHostComponent);
      host = fixture.componentInstance;
      await settle(fixture);
    });

    it('activates the tab from a static activeId attribute', () => {
      expect(activeHeaderIds(fixture)).toEqual(['second']);
    });

    it('renders the TabTitle template next to the title', () => {
      const link = el(fixture).querySelector('.nav-link[id="second"]');
      expect(link.querySelector('.custom-title')?.textContent).toBe('Second');
      expect(el(fixture).querySelector('.nav-link[id="first"]').textContent.trim()).toBe('First');
    });

    it('applies static titleClass and paneClass', () => {
      expect(el(fixture).querySelector('.nav-link[id="first"]').classList).toContain('first-title');
      expect(el(fixture).querySelector('.tab-pane[aria-labelledby="first"]').classList).toContain('first-pane');
    });

    it('renders the TabsetAfterNavItems template inside the header list', () => {
      expect(el(fixture).querySelector('.tab-header ul .after-nav-items')).not.toBeNull();
    });

    it('honours static load on a tab added by @if', async () => {
      host.showThird.set(true);
      await settle(fixture);

      expect(headerIds(fixture)).toEqual(['first', 'second', 'third']);
      expect(content(fixture, 'third')).toBeNull();

      host.tabset().select('third');
      await settle(fixture);
      expect(content(fixture, 'third')).not.toBeNull();
    });
  });

  describe('nested tabsets', () => {
    it('only collects direct tabs', async () => {
      const fixture = TestBed.createComponent(NestedHostComponent);
      await settle(fixture);

      const outer = el(fixture).querySelector('is-tabset.outer');
      const outerIds = Array.from(outer.querySelectorAll(':scope > .tab-header .nav-link')).map(l => l.id);
      const inner = el(fixture).querySelector('is-tabset.inner');
      const innerIds = Array.from(inner.querySelectorAll(':scope > .tab-header .nav-link')).map(l => l.id);

      expect(outerIds).toEqual(['outer-1', 'outer-2']);
      expect(innerIds).toEqual(['inner-1', 'inner-2']);
    });
  });

  describe('router integration', () => {
    it('activates the tab from the URL fragment', async () => {
      await TestBed.inject(Router).navigateByUrl('/#b');
      const fixture = TestBed.createComponent(ForHostComponent);
      fixture.componentInstance.useRouter.set(true);
      await settle(fixture);

      expect(activeHeaderIds(fixture)).toEqual(['b']);
    });

    it('writes the selected tab to the URL fragment', async () => {
      const router = TestBed.inject(Router);
      await router.navigateByUrl('/');
      const fixture = TestBed.createComponent(ForHostComponent);
      fixture.componentInstance.useRouter.set(true);
      await settle(fixture);

      fixture.componentInstance.tabset().select('c');
      await settle(fixture);
      await wait(0);

      expect(router.url).toBe('/#c');
      expect(activeHeaderIds(fixture)).toEqual(['c']);
    });

    it('follows fragment changes made outside the tabset', async () => {
      const router = TestBed.inject(Router);
      await router.navigateByUrl('/');
      const fixture = TestBed.createComponent(ForHostComponent);
      fixture.componentInstance.useRouter.set(true);
      await settle(fixture);

      await router.navigateByUrl('/#c');
      await settle(fixture);

      expect(activeHeaderIds(fixture)).toEqual(['c']);
      expect(fixture.componentInstance.events[0]).toEqual(expect.objectContaining({ nextId: 'c' }));
    });

    it('ignores the fragment when useRouter is off', async () => {
      await TestBed.inject(Router).navigateByUrl('/#b');
      const fixture = TestBed.createComponent(ForHostComponent);
      await settle(fixture);

      expect(activeHeaderIds(fixture)).toEqual(['a']);
    });
  });

  describe('overflowing header', () => {
    let fixture: ComponentFixture<ForHostComponent>;
    let host: ForHostComponent;

    const manyTabs = (invalidId?: string): TabDef[] =>
      Array.from({ length: 12 }, (_, i) => ({
        id: `t${i}`,
        title: `A rather long tab title ${i}`,
        valid: `t${i}` !== invalidId,
      }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ForHostComponent);
      host = fixture.componentInstance;
      host.width.set(300);
    });

    it('shows the right scroll button when tabs overflow', async () => {
      host.tabs.set(manyTabs());
      await settle(fixture);

      const right = el(fixture).querySelector('.scroll-btn.right') as HTMLElement;
      const left = el(fixture).querySelector('.scroll-btn.left') as HTMLElement;
      expect(right.style.display).toBe('flex');
      expect(left.style.display).toBe('');
    });

    it('shows the right scroll button once added tabs start to overflow', async () => {
      host.tabs.set([{ id: 'a' }]);
      await settle(fixture);
      const right = el(fixture).querySelector('.scroll-btn.right') as HTMLElement;
      expect(right.style.display).toBe('');

      host.tabs.set(manyTabs());
      await settle(fixture);
      expect(right.style.display).toBe('flex');
    });

    it('scrolls the selected tab into view', async () => {
      host.tabs.set(manyTabs());
      await settle(fixture);
      const ul = el(fixture).querySelector('.tab-header ul') as HTMLElement;
      expect(ul.scrollLeft).toBe(0);

      host.tabset().select('t11');
      await settle(fixture);
      await expect.poll(() => ul.scrollLeft).toBeGreaterThan(0);
    });

    it('indicates an invalid tab hidden on the right', async () => {
      host.tabs.set(manyTabs('t11'));
      await settle(fixture);

      await expect.poll(async () => {
        await settle(fixture);
        return el(fixture).querySelector('is-tabset > .tabset-invalid.right');
      }).not.toBeNull();
      expect(el(fixture).querySelector('is-tabset > .tabset-invalid.left')).toBeNull();
    });

    it('uses the TabsetInvalid template for the indicator', async () => {
      const invalidFixture = TestBed.createComponent(InvalidTemplateHostComponent);
      await settle(invalidFixture);

      await expect.poll(async () => {
        await settle(invalidFixture);
        return el(invalidFixture).querySelector('is-tabset > .tabset-invalid.right .custom-invalid');
      }).not.toBeNull();
      expect(el(invalidFixture).querySelector('is-tabset > .tabset-invalid.right .fa-exclamation')).toBeNull();
    });

    it('scrolls the header with the arrow buttons', async () => {
      host.tabs.set(manyTabs());
      await settle(fixture);
      const ul = el(fixture).querySelector('.tab-header ul') as HTMLElement;

      (el(fixture).querySelector('.scroll-btn.right i') as HTMLElement).click();
      await expect.poll(() => ul.scrollLeft).toBeGreaterThan(0);

      const scrolled = ul.scrollLeft;
      (el(fixture).querySelector('.scroll-btn.left i') as HTMLElement).click();
      await expect.poll(() => ul.scrollLeft).toBeLessThan(scrolled);
    });

    it('indicates a tab that becomes invalid later', async () => {
      host.tabs.set(manyTabs());
      await settle(fixture);
      await wait(250);
      await settle(fixture);
      expect(el(fixture).querySelector('is-tabset > .tabset-invalid.right')).toBeNull();

      host.tabs.set(manyTabs('t11'));
      await settle(fixture);
      await expect.poll(async () => {
        await settle(fixture);
        return el(fixture).querySelector('is-tabset > .tabset-invalid.right');
      }).not.toBeNull();
    });
  });

  describe('destroy', () => {
    it('can be destroyed with nowrap enabled', async () => {
      const fixture = TestBed.createComponent(ForHostComponent);
      await settle(fixture);

      expect(() => fixture.destroy()).not.toThrow();
    });

    it('can be destroyed with nowrap disabled', async () => {
      const fixture = TestBed.createComponent(ForHostComponent);
      fixture.componentInstance.nowrap.set(false);
      await settle(fixture);

      expect(() => fixture.destroy()).not.toThrow();
    });

    it('stops a running header scroll', async () => {
      const fixture = TestBed.createComponent(ForHostComponent);
      await settle(fixture);
      const tabset = fixture.componentInstance.tabset();
      const ul = el(fixture).querySelector('.tab-header ul') as HTMLElement;
      const scrollBy = vi.spyOn(ul, 'scrollBy');

      tabset.startScrollLeft();
      fixture.destroy();
      await wait(250);

      expect(scrollBy).not.toHaveBeenCalled();
    });
  });
});
