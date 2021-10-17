import {
  animate,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { isPlatform } from '@ionic/angular';
import { ThemeService } from 'src/app/services/theme.service';
import { MonetColors } from 'src/plugins/theme.plugin';

@Component({
  selector: 'app-color-box',
  templateUrl: './color-box.component.html',
  styleUrls: ['./color-box.component.scss'],
  animations: [
    trigger('pop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.5)' }),
        animate('150ms ease-in', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate(
          '100ms ease-out',
          style({ opacity: 0, transform: 'scale(.5)' })
        ),
      ]),
    ]),
  ],
})
export class ColorBoxComponent implements OnInit {
  @Input() color: string = null;
  @Input() colors: string[] = [];
  @Input() selected = false;

  @Input() monetColors: MonetColors = null;

  constructor(
    private themeService: ThemeService,
    private element: ElementRef
  ) {}

  ngOnInit() {
    if (this.colors.length) return;
    this.fetchColors();
  }

  async fetchColors() {
    if (isPlatform('android') && this.color) {
      this.monetColors = await this.themeService.getMonetColors(this.color);
      this.themeService.applyMonetColorsToElement(
        this.element.nativeElement,
        this.monetColors
      );
    }
  }

  handleClick() {
    if (isPlatform('android') && this.color) {
      this.themeService.applyMonetColors(this.monetColors);
    }
  }
}
