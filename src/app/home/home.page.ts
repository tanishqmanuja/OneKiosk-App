import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthData, AuthService } from '../services/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tabs = [
    {
      name: 'attendance',
      label: 'Attendance',
      icon: 'reader-outline',
      iconActive: 'reader',
    },
    {
      name: 'report',
      label: 'Report',
      icon: 'trophy-outline',
      iconActive: 'trophy',
    },
    {
      name: 'dashboard',
      label: 'Home',
      icon: 'home-outline',
      iconActive: 'home',
    },
    {
      name: 'timetable',
      label: 'Timetable',
      icon: 'time-outline',
      iconActive: 'time',
    },
    {
      name: 'others',
      label: 'Others',
      icon: 'prism-outline',
      iconActive: 'prism',
    },
  ];

  selectedTab = this.tabs[0].name;

  authData: AuthData = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authData = this.authService.getAuthData();
    if (!this.authData) {
      this.router.navigateByUrl('/login', { skipLocationChange: true });
    }
  }

  tabClicked(e: { tab: string }) {
    this.selectedTab = e.tab;
  }
}
