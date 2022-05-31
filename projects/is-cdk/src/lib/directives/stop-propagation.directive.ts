
import { Directive, HostListener } from '@angular/core';


@Directive({
  selector: '[isStopPropagation]'
})
export class StopPropagationDirective {

  @HostListener('click', ['$event'])
  onClick($event) {
    $event.stopPropagation();
  }

}
