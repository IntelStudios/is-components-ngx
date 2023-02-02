import {ComponentFixture} from '@angular/core/testing';
import {ChangeDetectorRef, DebugElement, ElementRef, EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {first} from 'rxjs/operators';
import {By} from '@angular/platform-browser';


export class EventEmitterHandler<T> {
  get hasNewValue(): boolean {
    return this._hasNewValue;
  }

  /**
   * Gets all values sorted by their order
   * Sets hasNewValue to false
   */
  get values(): T[] {
    this._hasNewValue = false;
    return [...this._values];
  }

  /**
   * Gets the last received value
   * Sets hasNewValue to false
   */
  get valueLast(): T {
    return this.values.pop();
  }

  private _values: T[] = [];
  private _hasNewValue = false;

  constructor(emitter: EventEmitter<T>) {
    emitter.subscribe((value: T) => {
      this._values.push(value);
      this._hasNewValue = true;
    });
  }

  /**
   * Waits until a new value is emitted from the source
   * Every time the wait time W is set to ((W + 1) x 2)
   */
  waitForNewValue(): Promise<void> {
    if (this.hasNewValue) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let interval = 0;
      const nextCycle = () => setTimeout(() => {
        if (this.hasNewValue) {
          resolve();
          return;
        }
        interval = Math.max((interval + 1) * 2, 100);
        nextCycle();
      }, interval);
      nextCycle();
    });
  }
}



export class TestComponentBase<T> {
  public fixture: ComponentFixture<T>;
  public readonly changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.changeDetector = changeDetector;
  }

  /**
   * Make the element visible
   * @param el element to be made visible
   * @private
   */
  protected static useElement(el: ElementRef<HTMLElement>): ElementRef<HTMLElement> {
    el.nativeElement.style.visibility = 'visible';
    el.nativeElement.style.position = 'static';
    return el;
  }

  /**
   * Waits until a first value change is fired and changes are processed, then returns the fired value
   * @param control which form control to listen to
   * @param value a new value to set
   */
  public async onFirstValue(control: FormControl, value: any): Promise<unknown> {
    return new Promise((resolve) => {
      control.valueChanges.pipe(first()).subscribe((val) => {
        this.afterChanges().then(() => resolve(val));
      });
      control.setValue(value);
    });
  }

  /**
   * Waits until an HTML element event occurs
   * @param component event on which the event should occur
   * @param eventName name of the event to add listener for
   */
  public async onFirstEvent(component: HTMLElement, eventName: string): Promise<unknown> {
    return new Promise((resolve) => {
      component.addEventListener(eventName, resolve);
    });
  }

  /**
   * Waits until the disabled state changes and changes are processed, then returns current disabled state
   * @param control which form control to listen to
   * @param disabled true to disable the element, false to enable element
   */
  public async onDisabledChange(control: FormControl, disabled: boolean): Promise<boolean> {
    return new Promise((resolve) => {
      control.registerOnDisabledChange((val) => {
        if (val === disabled) {
          this.afterChanges().then(() => resolve(val));
        }
      });
      if (disabled) {
        control.disable();
      } else {
        control.enable();
      }
    });
  }

  /**
   * Waits until all changes are processed and the component is rendered in a stable state
   */
  public async afterChanges(): Promise<unknown> {
    this.changeDetector.detectChanges();
    this.fixture.detectChanges();

    return Promise.all([this.fixture.whenStable(), this.fixture.whenRenderingDone()]);
  }

  public async afterTick(millis?: number): Promise<undefined> {
    return  new Promise((resolve) => setTimeout(() => resolve(undefined), millis));
  }

  public getDebugElement(elementRef: ElementRef<HTMLElement>): DebugElement | null {
    if (!elementRef.nativeElement.id) {
      return null;
    }

    return this.fixture.debugElement.query(By.css(`#${elementRef.nativeElement.id}`));
  }

  /**
   * Finds a debug element of a <body> element
   * @protected
   */
  protected getBodyDebugElement(): DebugElement {
    let el = this.fixture.debugElement;

    while ((el.nativeElement as HTMLElement)?.tagName.toLowerCase() !== 'body') {
      el = el.parent;
    }

    return el;
  }

  /**
   * Finds a HTML element as fixture debug element
   * @param element html element to by found as debug element
   */
  public getDebugElementFromHTMLElement(element: HTMLElement): DebugElement {
    const randomClass = `testClass${Math.floor(Math.random() * 10000)}`;
    element.classList.add(randomClass);
    const debugElement = this.getBodyDebugElement().query(By.css(`.${randomClass}`));
    element.classList.remove(randomClass);
    return debugElement;
  }
}
