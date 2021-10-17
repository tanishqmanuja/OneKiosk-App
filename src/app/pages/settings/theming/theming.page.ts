import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeMode, ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-theming',
  templateUrl: './theming.page.html',
  styleUrls: ['./theming.page.scss'],
  animations: [
    trigger('pop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.5)' }),
        animate('150ms ease-in', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate(
          '150ms ease-out',
          style({ opacity: 0, transform: 'scale(.5)' })
        ),
      ]),
    ]),
  ],
})
export class ThemingPage implements OnInit, OnDestroy {
  assortedColors = [
    {
      name: 'neutral blue',
      color: '#1b6ef3',
    },
    {
      name: 'tangy orange',
      color: '#fb8500',
    },
    {
      name: 'vivid pink',
      color: '#e63946',
    },
    {
      name: 'tinted purple',
      color: '#6930c3',
    },
    {
      name: 'medium teal',
      color: '#219ebc',
    },
    {
      name: 'marine green',
      color: '#2d6a4f',
    },
    {
      name: 'muted pink',
      color: '#ff1b6e',
    },
    {
      name: 'parrot green',
      color: '#fdfcdc',
    },
  ];

  themeMode: ThemeMode = ThemeMode.default;
  selectedAccentIndex = 0;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeMode = this.themeService.currentTheme.mode;

    const selectedIndex = this.assortedColors.findIndex(
      (item) =>
        item.color === this.themeService.currentTheme.monetGeneratorColor
    );
    if (selectedIndex >= 0) this.selectedAccentIndex = selectedIndex;
  }

  ngOnDestroy() {
    const clrs = this.themeService.currentTheme.monetColors;
    if (clrs) {
      this.themeService.applyMonetColors(clrs);
    }
  }

  get isNeedToApply() {
    return !(
      this.assortedColors[this.selectedAccentIndex].color ===
      this.themeService.currentTheme.monetGeneratorColor
    );
  }

  changeMode(mode: any) {
    if (mode === ThemeMode.dark) this.themeService.enableDarkMode();
    else if (mode === ThemeMode.light) this.themeService.enableLightMode();
    else this.themeService.enableDefaultMode();
    this.themeMode = mode;
  }

  changeAccent(index: number) {
    this.selectedAccentIndex = index;
  }

  async applyAccent() {
    const color = this.assortedColors[this.selectedAccentIndex].color;
    const clrs = await this.themeService.getMonetColors(color);
    await this.themeService.saveMonetColors(clrs);
    await this.themeService.saveMonetGeneratorColor(color);
  }
}
