import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import {
  IonRouterOutlet,
  isPlatform,
  ModalController,
  Platform,
} from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;

  constructor(
    private platform: Platform,
    private themeService: ThemeService,
    private modalController: ModalController,
    private authService: AuthService
  ) {
    this.initializeApp();
    this.themeService.init();
  }

  async initializeApp() {
    if (isPlatform('android')) {
      try {
        await StatusBar.setOverlaysWebView({ overlay: true });
      } catch (e) {}
    }
    this.platform.backButton.subscribe(async () => {
      if (!this.routerOutlet.canGoBack()) {
        if (await this.modalController.getTop()) {
          this.modalController.dismiss();
        } else (navigator as any).app.exitApp();
      }
    });
  }
}
