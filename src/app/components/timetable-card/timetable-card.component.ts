import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GestureController } from '@ionic/angular';
import { TimetableItem } from 'src/app/services/timetable.service';

@Component({
  selector: 'app-timetable-card',
  templateUrl: './timetable-card.component.html',
  styleUrls: ['./timetable-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimetableCardComponent implements AfterViewInit {
  @Input() data: TimetableItem;
  @Input() holiday = false;
  @Output() optionPressed = new EventEmitter<string>();

  @ViewChild('card') card: ElementRef;
  @ViewChild('options') options: ElementRef;

  optionMode = false;

  constructor(private gestureCtrl: GestureController) {}

  ngAfterViewInit() {
    if (this.card) {
      this.enableCardGesture();
    }
  }

  enableCardGesture() {
    const gesture = this.gestureCtrl.create({
      el: this.card.nativeElement,
      gestureName: 'showOptions',
      onStart: (ev) => {
        this.card.nativeElement.style.transition = '0.4s ease-out';
        this.options.nativeElement.style.transition = '0.4s ease-out';
      },
      onMove: (ev) => {
        if (!this.optionMode) {
          const limitDX = this.clamp(ev.deltaX, 0, 80);
          this.card.nativeElement.style.transform = `translateX(${limitDX}px)`;
        } else {
          const limitDX = this.clamp(ev.deltaX, -30, 0);
          this.card.nativeElement.style.transform = `translateX(${limitDX}px)`;
        }
      },
      onEnd: (ev) => {
        if (ev.deltaX > 60 && !this.optionMode) {
          this.optionMode = true;
          this.card.nativeElement.style.transform = `translateX(calc(var(--card-height) / 2 + var(--side-clearence)))`;

          this.options.nativeElement.style.transform = `scale(1)`;
        } else if (ev.deltaX < -15 && this.optionMode) {
          this.optionMode = false;
          this.card.nativeElement.style.transform = '';

          this.options.nativeElement.style.transform = `scale(0.85)`;
        } else {
          this.optionMode = false;
          this.card.nativeElement.style.transform = '';

          this.options.nativeElement.style.transform = `scale(0.85)`;
        }
      },
    });

    gesture.enable();
  }

  formatTime(time: number) {
    if (time < 12) return time + ' am';
    if (time > 12) return time - 12 + ' pm';
    return time + ' pm';
  }

  clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
}
