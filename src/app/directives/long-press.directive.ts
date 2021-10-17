import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  NgZone,
  EventEmitter,
  Output,
} from '@angular/core';
import { GestureController } from '@ionic/angular';

@Directive({
  selector: '[appLongPress]',
})
export class LongPressDirective implements AfterViewInit {
  @Output() press = new EventEmitter();
  @Input() delay = 200;
  action: any; //not stacking actions

  private longPressActive = false;

  constructor(
    private el: ElementRef,
    private gestureCtrl: GestureController,
    private zone: NgZone
  ) {}

  ngAfterViewInit() {
    this.loadLongPressOnElement();
  }

  loadLongPressOnElement() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      threshold: 0,
      gestureName: 'long-press',
      onStart: (ev) => {
        this.longPressActive = true;
        this.longPressAction();
      },
      onEnd: (ev) => {
        this.longPressActive = false;
        this.longPressAction(true);
      },
    });
    gesture.enable(true);
  }

  private longPressAction(stop?: boolean) {
    if (this.action) {
      clearInterval(this.action);
    }
    if (stop) return;
    this.action = setInterval(() => {
      this.zone.run(() => {
        if (this.longPressActive === true) {
          this.press.emit();
        }
      });
    }, this.delay);
  }
}
