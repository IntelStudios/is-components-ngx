import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IsEncapsulatedComponent } from './is-encapsulated.component';

type ParseTest = {
  css: string,
  name: string,
}

describe('IsEncapsulatedComponent', () => {
  let component: IsEncapsulatedComponent;
  let fixture: ComponentFixture<IsEncapsulatedComponent>;

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
    component.html = `
    <style>body {color: red;}</style>
    <p>test</p>
    `;
    component.ngOnChanges({
      html: new SimpleChange(null, component.html, true),
    });
    const css = fixture.nativeElement.querySelector('style').innerText;
    expect(css).toContain('is-encapsulated');
  })

  const parseTests: ParseTest[] = [
    {
      name: 'Empty',
      css: '',
    },
    {
      name: 'Simple style',
      css: `
            body 
            { color: red;}`,
    },
    {
      name: 'Single line comment',
      css: '/* single line coment */'
    },
    {
      name: 'Multi line comment',
      css: `<!--
            multi line comment
            body {color: blue}
            -->`
    },
    {
      name: 'Keyframes',
      css: `
      
	.progress {
		background: #378d8d;
		justify-content: flex-start;
		border-radius: 100px;
		align-items: center;
		position: relative;
		padding: 0 5px;
		display: flex;
		height: 40px;
		width: 90%;
		color: #fff;
		margin: auto;
	}
	/*front of bar*/
	
	.progress-value {
		animation: load 3s normal forwards;
		box-shadow: 0 10px 40px -10px #fff;
		border-radius: 100px;
		background: white;
		height: 30px;
		width: 33%;
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

      `
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
          `
    }
  ];

  parseTests.forEach((t) => {
    it(`parseCss: ${t.name}`, () => {
      const result = component.parseCss(t.css);
      expect(result).toBeTruthy(result);
    })
  })
});
