import {EventEmitterHandler, TestComponentBase} from '../../../../test-base/model.spec';
import {ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {IsIFrameClickDirective} from './iframe-click.directive';


describe('IsIFrameClickDirective', () => {
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

  it('should handle click on paragraph', async () => {
    const frame = componentRoot.frameEl;
    const handler = new EventEmitterHandler(componentRoot.frameDirective.isIframeClick);

    const onLoad = componentRoot.onFirstEvent(frame.nativeElement, 'load');
    frame.nativeElement.srcdoc = '<html><body><p>Working</p></body></html>';

    await onLoad;
    await componentRoot.afterChanges();
    frame.nativeElement.contentDocument.dispatchEvent(new Event('click'));

    await handler.waitForNewValue();
    expect(true).toBeTruthy();
  });
});

@Component({
    template: `
    <iframe #frame [isIframeClick]></iframe>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [IsIFrameClickDirective],
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
