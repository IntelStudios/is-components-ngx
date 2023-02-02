import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IsEncapsulatedComponent } from './is-encapsulated.component';

interface ParseTest {
  css: string;
  name: string;
  expected: (ParseTestRule | ParseTestKeyframe)[];
}

interface ParseTestRule {selector: string; property: string; value: string; }
interface ParseTestKeyframe {
  frames: {
    values: string[];
    declarations: {
      property: string;
      value: string;
    }[];
  }[];
}


interface ParseResult {
  stylesheet: {
    rules: {
      type: string;
      selectors: string[],
      declarations: ParseResultDeclaration[],
      keyframes: {
        type: string,
        values: string[]
        declarations: ParseResultDeclaration[]
      }[],
    }[],
    parsingErrors: unknown[]
  };
}

interface ParseResultDeclaration {
  property: string;
  value: string;
}

describe('IsEncapsulatedComponent', () => {
  let component: IsEncapsulatedComponent;
  let fixture: ComponentFixture<IsEncapsulatedComponent>;

  function testCSSParsing(testCase: ParseTest): void {
    const result: ParseResult = component.parseCss(testCase.css);
    const expectedFailOutput = [testCase, result];

    // no parse errors should occur
    expect(result.stylesheet.parsingErrors.length).toBe(0, expectedFailOutput);

    // expected elements should have correct length
    const rules = result.stylesheet.rules.filter((x) => x.type !== 'comment');
    expect(rules.length).toBe(testCase.expected.length, expectedFailOutput);

    // check that all parsed rules are expected and accounted for
    expect(compareArrayContent(rules, testCase.expected, (rule, expectedRule) => {
      // compare all CSS rules with expected CSS rules
      if (rule.type === 'rule' && 'selector' in expectedRule) {
        if (rule.selectors.indexOf(expectedRule.selector) === -1) {
          return false;
        }
        return rule.declarations.find((d) => d.property === expectedRule.property && d.value === expectedRule.value) !== undefined;
        // compare all keyframe rules with all expected keyframes
      } else if (rule.type === 'keyframes' && 'frames' in expectedRule) {
        const keyframes = rule.keyframes.filter((x) => x.type !== 'comment');

        compareArrayContent(keyframes, expectedRule.frames, (keyframe, expectedFrame) => {
          return compareArrayContent(keyframe.values, expectedFrame.values) &&
            compareArrayContent(keyframe.declarations, expectedFrame.declarations, (declaration, expectedDeclaration) => {
              return declaration.value === expectedDeclaration.value && declaration.property === expectedDeclaration.property;
            });
        });

        return true;
      }

      return false;
    })).toBeTruthy(expectedFailOutput);
  }

  function encapsulateHTML(html: string): {root:  HTMLElement, style: HTMLStyleElement} {
    const fixtureEl = fixture.nativeElement as HTMLElement;
    const testClass = 'test-1701-d';
    const encapsulatedCSSQueryPrefix = `.${testClass} > div`;
    fixtureEl.classList.add(testClass);

    component.html = html;
    component.ngOnChanges({
      html: new SimpleChange(null, component.html, true),
    });

    const encapsulatedContent = fixtureEl.querySelector(encapsulatedCSSQueryPrefix) as HTMLElement;
    expect(encapsulatedContent).toBeTruthy();

    const styleElement = fixtureEl.querySelector(`${encapsulatedCSSQueryPrefix} > style`) as HTMLStyleElement;
    expect(styleElement).toBeTruthy();

    return {
      root: encapsulatedContent,
      style: styleElement
    };
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IsEncapsulatedComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsEncapsulatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('create component', () => {
    expect(component).toBeTruthy();
  });

  it('encapsulate', () => {
    const {root, style} = encapsulateHTML(`
    <style>body {color: red;}</style>
    <p>test</p>
    `);

    const css = style.innerText;
    expect(css).toContain('is-encapsulated');

    const paragraph = root.querySelector('p');
    expect(paragraph).toBeTruthy();
    expect(paragraph.parentElement).toBe(root);
    expect(paragraph.innerHTML).toBe('test');
  });

  const parseTests: ParseTest[] = [
    {
      name: 'Empty',
      css: '',
      expected: []
    },
    {
      name: 'Simple style',
      css: `
            body
            { color: red;}`,
      expected: [{selector: 'body', property: 'color', value: 'red'}]
    },
    {
      name: 'Single line comment',
      css: '/* single line comment */',
      expected: []
    },
    {
      name: 'Single line comment containing style',
      css: '/* body { color: red; } */',
      expected: []
    },
    {
      name: 'Multi line comment',
      css: `<!--
            multi line comment
            body {color: blue}
            -->`,
      expected: []
    },
    {
      name: 'Keyframes',
      css: `
	.progress-value {
		animation: load 3s normal forwards;
	}

	@keyframes load {
		0% {
			width: 0;
		}
		100% {
			width: 33%;
			/*percentage value*/
		}
	}
      `,
      expected: [
        {selector: '.progress-value', property: 'animation', value: 'load 3s normal forwards'},
        {frames: [
            {values: ['0%'], declarations: [{property: 'width', value: '0'}]},
            {values: ['100%'], declarations: [{property: 'width', value: '33%'}]}
          ]}
      ]
    },
    {
      name: 'Multi line comment containing single line comment and styles',
      css: `
            <!--

            /* Font Definitions */

            @font-face {
                font-family: "Cambria Math";
                panose-1: 2 4 5 3 5 4 6 3 2 4;
            }

            @font-face {
                font-family: Calibri;
                panose-1: 2 15 5 2 2 2 4 3 2 4;
            }
            /* Style Definitions */

            p.MsoNormal,
            li.MsoNormal,
            div.MsoNormal {
                margin: 0cm;
                font-size: 11.0pt;
                font-family: "Calibri", sans-serif;
                mso-ligatures: standardcontextual;
            }

            span.EmailStyle17 {
                mso-style-type: personal-compose;
                font-family: "Calibri", sans-serif;
                color: windowtext;
            }

            .MsoChpDefault {
                mso-style-type: export-only;
                font-family: "Calibri", sans-serif;
                mso-ligatures: standardcontextual;
            }

            @page WordSection1 {
                size: 612.0pt 792.0pt;
                margin: 72.0pt 72.0pt 72.0pt 72.0pt;
            }

            div.WordSection1 {
                page: WordSection1;
            }

            -->
            body { color: orange; }
          `,
      expected: [{selector: 'body', property: 'color', value: 'orange'}]
    }
  ];

  // test parsing only
  parseTests.forEach((t) => {
    it(`parseCss: ${t.name}`, () => {
      testCSSParsing(t);
    });
  });

  // test applying the CSS to an encapsulated component
  parseTests.forEach((t) => {
    it(`encapsulateCSS: ${t.name}`, () => {
      const testCase = {...t};
      const {root, style} = encapsulateHTML(`
      <style>${t.css}</style>
      <p>TeSt</p>
      `);
      testCase.css = style.innerHTML;
      testCase.expected = testCase.expected.map((rule) => {
        rule = {...rule};

        if ('selector' in rule) {
          rule.selector = rule.selector.replace('body', '');
          rule.selector = `is-encapsulated > .${root.className} ${rule.selector}`;
          rule.selector = rule.selector.replace(/\s+/g, ' ').trim();
        }

        return rule;
      });

      testCSSParsing(testCase);
    });
  });
});

/**
 * Checks if two arrays contain the same (unordered) content
 * @param a first array to compare
 * @param b second array to compare
 * @param compare optional comparison function to check that two elements are equal
 */
function compareArrayContent<T, K>(a: T[], b: K[], compare?: (x: T, y: K) => boolean): boolean {
  a = [...a];
  b = [...b];

  if (a.length !== b.length) {
    return false;
  }

  if (compare === undefined) {
    // @ts-ignore
    compare = (x, y) => x === y;
  }

  for (const x of a) {
    const yIndex = b.findIndex((y) => compare(x, y));
    if (yIndex === -1) {
      return false;
    }

    b.splice(yIndex, 1);
  }

  return true;
}
