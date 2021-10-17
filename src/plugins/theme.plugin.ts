import { registerPlugin } from '@capacitor/core';
import { WebPlugin } from '@capacitor/core';

import { hcl_to_sRGB, sRGB_to_JCh } from 'color-calculus';

export interface MonetColors {
  accent1: string[];
  accent2: string[];
  accent3: string[];
  neutral1: string[];
  neutral2: string[];
}

export interface ThemePlugin {
  isDarkModeEnabled(): Promise<{ value: string }>;
  enableDarkMode(): Promise<void>;
  enableLightMode(): Promise<void>;
  enableDefaultMode(): Promise<void>;
  setBackgroundColors({ light, dark }): Promise<void>;
  getMonetColors({ color }): Promise<MonetColors>;
}

export class ThemeWeb extends WebPlugin implements ThemePlugin {
  async isDarkModeEnabled(): Promise<{ value: string }> {
    return;
  }

  async enableDarkMode(): Promise<void> {
    return;
  }

  async enableLightMode(): Promise<void> {
    return;
  }

  async enableDefaultMode(): Promise<void> {
    return;
  }

  async setBackgroundColors(): Promise<void> {
    return;
  }

  async getMonetColors({ color }): Promise<MonetColors> {
    const rgbToHex = (r: number, g: number, b: number) =>
      '#' +
      [r, g, b]
        .map((x) => {
          const xx = Math.max(Math.min(Math.round(x), 255), 0);
          const hex = xx.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');

    const hexToRgb = (hex: string) =>
      hex
        .replace(
          /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
          (m, r, g, b) => '#' + r + r + g + g + b + b
        )
        .substring(1)
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16));

    const shadesOf = (hue: number, chroma: number) => {
      const iArr = Array(12);

      iArr[0] = [hue, chroma, 99.0];
      iArr[1] = [hue, chroma, 95.0];

      let i = 2;
      while (i < 11) {
        iArr[i] = [hue, chroma, i === 6 ? 49.6 : 100.0 - (i - 1.0) * 10.0];
        i++;
      }

      iArr[11] = [0, 0, 0];

      return iArr
        .map((c) => hcl_to_sRGB(c))
        .map((c) => rgbToHex(...c))
        .map((c) => (c.includes('NAN') ? '#000000' : c));
    };

    const cHue = sRGB_to_JCh(hexToRgb(color))[2];

    const palette = {
      accent1: shadesOf(cHue, 48.0),
      accent2: shadesOf(cHue, 16.0),
      accent3: shadesOf(cHue + 60.0, 32.0),
      neutral1: shadesOf(cHue, 4.0),
      neutral2: shadesOf(cHue, 8.0),
    };

    return palette;
  }
}

const Theme = registerPlugin<ThemePlugin>('Theme', { web: new ThemeWeb() });

export default Theme;
