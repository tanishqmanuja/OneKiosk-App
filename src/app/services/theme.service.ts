import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import Theme, { MonetColors } from '../../plugins/theme.plugin';
import { isPlatform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

export interface ThemeData {
  mode: ThemeMode;
  willBeDarkMode?: boolean;
  monetGeneratorColor?: string;
  monetColors?: MonetColors;
}

export enum ThemeMode {
  dark = 'DARK',
  light = 'LIGHT',
  default = 'DEFAULT',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeData: ThemeData = {
    mode: ThemeMode.default,
  };

  constructor(private storage: StorageService) {}

  async init() {
    const themeData = await this.storage.get(this.storage.locations.theme);

    if (!themeData) {
      this.storage.set(this.storage.locations.theme, this.themeData);
      return;
    }

    this.themeData = themeData;

    if (this.themeData.mode === ThemeMode.dark) {
      this.enableDarkMode();
    } else if (this.themeData.mode === ThemeMode.light) {
      this.enableLightMode();
    } else {
      // prevent abrupt screen flash on app init based on previous theme mode
      if (this.themeData.willBeDarkMode) {
        document.body.classList.add('dark');
        if (isPlatform('android')) {
          this.setDarkModeStatusBar();
        }
      }

      this.enableDefaultMode();
    }

    if (themeData.monetColors) {
      this.applyMonetColors(this.themeData.monetColors);
    }
  }

  get currentTheme() {
    return this.themeData;
  }

  enableDarkMode() {
    document.body.classList.add('dark');
    this.themeData.mode = ThemeMode.dark;
    this.storage.set(this.storage.locations.theme, this.themeData);

    if (isPlatform('android')) {
      this.setDarkModeStatusBar();
      Theme.enableDarkMode();
    }
  }

  enableLightMode() {
    document.body.classList.remove('dark');
    this.themeData.mode = ThemeMode.light;
    this.storage.set(this.storage.locations.theme, this.themeData);

    if (isPlatform('android')) {
      this.setLightModeStatusBar();
      Theme.enableLightMode();
    }
  }

  async enableDefaultMode() {
    if (isPlatform('android')) {
      const { value: isDarkModeEnabled } = await Theme.isDarkModeEnabled();
      if (isDarkModeEnabled) {
        document.body.classList.add('dark');
        this.setDarkModeStatusBar();
        this.themeData.willBeDarkMode = true;
      } else {
        document.body.classList.remove('dark');
        this.setLightModeStatusBar();
        this.themeData.willBeDarkMode = false;
      }
      this.themeData.mode = ThemeMode.default;
      this.storage.set(this.storage.locations.theme, this.themeData);
      Theme.enableDefaultMode();
    }
  }

  async getMonetColors(color: string) {
    if (isPlatform('android')) {
      const val = await Theme.getMonetColors({ color });
      return val;
    } else {
      return;
    }
  }

  applyMonetColors(colors: MonetColors) {
    const shadeCodes = [10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    for (const [accent, shades] of Object.entries(colors)) {
      shades.slice(0, -1).forEach((shade: string, index: number) => {
        const key = `--you-${accent.charAt(0)}${accent.slice(-1)}-${
          shadeCodes[index]
        }`;
        const value = shade;
        document.documentElement.style.setProperty(key, value);
      });
    }
  }

  applyMonetColorsToElement(element: HTMLDivElement, colors: MonetColors) {
    const shadeCodes = [10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    for (const [accent, shades] of Object.entries(colors)) {
      shades.slice(0, -1).forEach((shade: string, index: number) => {
        const key = `--you-${accent.charAt(0)}${accent.slice(-1)}-${
          shadeCodes[index]
        }`;
        const value = shade;
        element.style.setProperty(key, value);
      });
    }
  }

  async saveMonetColors(colors: MonetColors) {
    this.themeData.monetColors = colors;
    if (isPlatform('android')) {
      Theme.setBackgroundColors({
        light: this.themeData.monetColors.neutral1[0],
        dark: this.themeData.monetColors.neutral1[10],
      });
    }
    await this.storage.set(this.storage.locations.theme, this.themeData);
  }

  async saveMonetGeneratorColor(color: string) {
    this.themeData.monetGeneratorColor = color;
    await this.storage.set(this.storage.locations.theme, this.themeData);
  }

  private async setDarkModeStatusBar() {
    if (isPlatform('android')) {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
      } catch (e) {}
    }
  }

  private async setLightModeStatusBar() {
    if (isPlatform('android')) {
      try {
        await StatusBar.setStyle({ style: Style.Light });
      } catch (e) {}
    }
  }
}
