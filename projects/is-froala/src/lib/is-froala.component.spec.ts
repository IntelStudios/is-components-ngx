import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IsFroalaComponent } from './is-froala.component';
import { IsFroalaService } from './is-froala.service';
import {EventEmitterHandler, TestComponentBase} from '../../../test-base/model.spec';
import {ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormControlDirective} from '@angular/forms';
import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {IsCdkModule, IsCdkService} from '@intelstudios/cdk';
import {TranslateMockModule} from '@hetznercloud/ngx-translate-mock';
import { IsEncapsulatedComponent } from 'projects/is-cdk/src/public-api';

describe('IsFroalaComponent', () => {
  let componentRoot: TestComponent;
  let fixtureRoot: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        FormControlDirective,
        IsFroalaComponent,
        IsEncapsulatedComponent
      ],
      imports: [OverlayModule, CommonModule, BrowserModule, TranslateMockModule, IsCdkModule],
      providers: [
        {provide: IsCdkService},
        {provide: IsFroalaService},
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureRoot = TestBed.createComponent(TestComponent);
    componentRoot = fixtureRoot.componentInstance;
    componentRoot.fixture = fixtureRoot;
    fixtureRoot.detectChanges();
  });

  it('should create', () => {
    expect(componentRoot).toBeTruthy();
  });

  it('should set value', async () => {
    const control = componentRoot.control;
    const froala = componentRoot.froalaEl;

    await componentRoot.onFirstValue(control, '<a class="testLink" href="https://example.com/test225">link text</a>');

    const content = componentRoot.getIframeContent(froala);
    expect(content).withContext('content should exist').toBeDefined();

    const link = content.querySelector('.testLink') as HTMLAnchorElement;
    expect(link).withContext('passed link should be rendered as HTML');

    expect(link.href).withContext('link should preserve its href').toBe('https://example.com/test225');
  });

  it('preview should have fixed height', async  () => {
    const {froalaFixed, froalaFixedEl} = componentRoot;

    let value = '';
    for (let y = 0; y < 400; y++) {
      for (let x = 0; x < 100; x++) {
        value += 'TeSt_WoRd ';
      }
      value += '\n';
    }

    froalaFixed.writeValue(value);
    await componentRoot.afterChanges();

    const froalaPreviewSize = froalaFixedEl.nativeElement.getBoundingClientRect();
    expect(froalaPreviewSize.height).toBeGreaterThanOrEqual(150);
    expect(froalaPreviewSize.height).toBeLessThanOrEqual(170);

    froalaFixed.loadEditor();
    await componentRoot.afterChanges();

    const froalaWrapperSize = componentRoot.getFroalaWrapper(froalaFixedEl).getBoundingClientRect();
    expect(froalaWrapperSize.height).toBeGreaterThanOrEqual(150);
    expect(froalaWrapperSize.height).toBeLessThanOrEqual(150);
  });

  it('should load content immediately', async () => {
    const {froalaEl} = componentRoot;

    await componentRoot.afterChanges();
    expect(componentRoot.getPreviewBorder(froalaEl)).toBeNull();
    expect(componentRoot.getIframeContent(froalaEl)).not.toBeNull();
  });

  it('should load content after click when enabled', async () => {
    const {froalaFixedEl} = componentRoot;

    await componentRoot.afterChanges();
    expect(componentRoot.getPreviewBorder(froalaFixedEl)).not.toBeNull();
    expect(componentRoot.getIframeContent(froalaFixedEl)).toBeNull();

    componentRoot.getPreviewBorder(froalaFixedEl).click();
    await componentRoot.afterChanges();
    expect(componentRoot.getPreviewBorder(froalaFixedEl)).toBeNull();
    expect(componentRoot.getIframeContent(froalaFixedEl)).not.toBeNull();
  });

  it('should emit image preview', async () => {
    const {froalaFixed} = componentRoot;
    const handler = new EventEmitterHandler(froalaFixed.onImagePreview);
    const expectedValue = 'tEsT-vAluE';

    // @ts-ignore
    const event: MouseEvent = {
      target: {
        // @ts-ignore
        localName: 'img',
        src: expectedValue
      }
    };

    froalaFixed.onReadonlyContentClick(event);
    await handler.waitForNewValue();
    expect(handler.valueLast).toBe(expectedValue);
  });
});

@Component({
  template: `
    <style>.test-hidden{visibility: hidden; position: fixed; left: 100vw;}</style>
    <is-froala #froala class="test-hidden" [options]="options" [formControl]="control"></is-froala>
    <is-froala #froalaFixed class="test-hidden" [minHeight]="150" [maxHeight]="150" [loadOnInit]="false"></is-froala>
  `
})
class TestComponent extends TestComponentBase<TestComponent> {
  get froalaFixedEl(): ElementRef<HTMLElement> {
    this._froalaFixedEl.nativeElement.classList.remove('test-hidden');
    return this._froalaFixedEl;
  }
  get froalaEl(): ElementRef<HTMLElement> {
    this._froalaEl.nativeElement.classList.remove('test-hidden');
    return this._froalaEl;
  }

  @ViewChild('froala', {static: false, read: ElementRef})
  private _froalaEl: ElementRef<HTMLElement>;

  @ViewChild('froalaFixed', {static: false})
  froalaFixed: IsFroalaComponent;

  @ViewChild('froalaFixed', {static: false, read: ElementRef}) private _froalaFixedEl: ElementRef<HTMLElement>;

  constructor(private cd: ChangeDetectorRef, public service: IsFroalaService) {
    super(cd);
  }

  readonly options = { id: 1 };
  readonly control = new FormControl();

  getIframeContent(froala: ElementRef<HTMLElement>): HTMLElement | null {
    const iFrame = froala.nativeElement.querySelector('.fr-iframe') as HTMLIFrameElement;
    return iFrame?.contentDocument.querySelector('.fr-view') || null;
  }

  getPreviewBorder(froala: ElementRef<HTMLElement>): HTMLElement | null {
    return froala.nativeElement.querySelector('.view-border');
  }

  getFroalaWrapper(froala: ElementRef<HTMLElement>): HTMLElement | null {
    return froala.nativeElement.querySelector('.fr-wrapper');
  }

  getButtonByName(froala: ElementRef<HTMLElement>, name: 'Code View'): HTMLElement | null {
    const toolbar = froala.nativeElement.querySelector('.fr-toolbar');

    const buttons = toolbar.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons.item(i);
      if (button.querySelector('.fr-sr-only')?.textContent.trim() === name) {
        return button;
      }
    }

    return null;
  }
}
