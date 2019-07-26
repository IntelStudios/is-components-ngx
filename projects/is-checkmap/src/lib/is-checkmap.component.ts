import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'is-checkmap',
  templateUrl: './is-checkmap.component.html',
  styleUrls: ['./is-checkmap.component.scss']
})
export class IsCheckmapComponent implements OnInit {

  private elLeft: HTMLDivElement;
  private elTop: HTMLDivElement;
  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  ngOnInit() {
    this.elLeft = this.el.nativeElement.querySelector('.left');
    this.elTop = this.el.nativeElement.querySelector('.top');
  }

  onScroll($event) {
    this.elLeft.scrollTop = $event.target.scrollTop;
    this.elTop.scrollLeft = $event.target.scrollLeft;
  }

  test() {

    const left = this.el.nativeElement.querySelector('.left');
    left.scrollTop = 100;
  }
}
