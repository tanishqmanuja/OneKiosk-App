import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appHeaderColor]',
})
export class HeaderColorDirective implements OnInit {
  @Input() scrollArea: any;
  private colored = false;
  private triggerDistance = 40;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.scrollArea.ionScroll.subscribe(
      (scrollEvent: { detail: { scrollTop: number; currentY: number } }) => {
        const delta = scrollEvent.detail.scrollTop;
        if (scrollEvent.detail.currentY === 0 && this.colored) {
          this.removeColor();
        } else if (!this.colored && delta > this.triggerDistance) {
          this.addColor();
        } else if (this.colored && delta < -this.triggerDistance) {
          this.removeColor();
        }
      }
    );
  }

  addColor() {
    this.element.nativeElement.classList.add('color');
    this.colored = true;
  }
  removeColor() {
    this.element.nativeElement.classList.remove('color');
    this.colored = false;
  }
}
