import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective {
  private _autofocus;

  constructor(public el: ElementRef) {
  }


  @Input() set autofocus(condition: boolean) {
    this._autofocus = condition != false;
  }

  ngOnInit() {
    if (this._autofocus || typeof this._autofocus === "undefined") {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 200);
    }
  }
}