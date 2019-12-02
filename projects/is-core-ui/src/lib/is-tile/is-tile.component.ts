import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'is-tile',
  templateUrl: './is-tile.component.html',
  styleUrls: ['./is-tile.component.scss']
})
export class IsTileComponent implements OnInit {

  @Input()
  icon: string;

  @Input()
  label: string;

  @Output()
  tileClick: EventEmitter<MouseEvent> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClick(event: MouseEvent) {
    this.tileClick.next(event);
  }

}
