import { Directive, ElementRef, AfterViewInit, Input, HostListener } from '@angular/core';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[stopPropagation]',
})

export class StopPropagationDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event']) onClick(event) {
    event.stopPropagation();
  }
}