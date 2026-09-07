import {TestComponentBase} from '../../../../test-base/model.spec';
import {ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {IsIFrameClickDirective} from './iframe-click.directive';
import {IsIFrameResizeDirective} from './iframe-resize.directive';


describe('IsIFrameResizeDirective', () => {
  let componentRoot: TestComponent;
  let fixtureRoot: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule, BrowserModule, TestComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixtureRoot = TestBed.createComponent(TestComponent);
    componentRoot = fixtureRoot.componentInstance;
    componentRoot.fixture = fixtureRoot;
    fixtureRoot.detectChanges();
  });

  it.skip('should resize', async () => {
    const frame = componentRoot.frameEl;

    const onLoad = componentRoot.onFirstEvent(frame.nativeElement, 'load');
    frame.nativeElement.srcdoc = '<html><body><style>html, body{margin: 0; padding: 0;} .large{width: 800px; height: 1200px; background: red;}</style><div class="large">TeSt</div></body></html>';

    await onLoad;
    await componentRoot.afterChanges();
    const size = frame.nativeElement.getBoundingClientRect();

    // only height is resized
    expect(size.width).toBeLessThan(600);

    expect(size.height).toBeGreaterThanOrEqual(1200);
    expect(size.height).toBeLessThanOrEqual(1210);
  });
});

@Component({
    template: `
    <iframe #frame isIframeResize></iframe>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [IsIFrameResizeDirective],
})
class TestComponent extends TestComponentBase<TestComponent> {
  @ViewChild('frame', {static: true, read: IsIFrameClickDirective})
  frameDirective: IsIFrameClickDirective;

  @ViewChild('frame', {static: true, read: ElementRef})
  frameEl: ElementRef<HTMLIFrameElement>;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }
}
