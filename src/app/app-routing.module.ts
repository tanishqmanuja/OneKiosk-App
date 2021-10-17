import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategyService } from './preloading/custom.preloading.service';

const routes: Routes = [
  {
    path: 'home',
    data: { preload: true },
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'attendance-details/:semcode/:coursecode',
    loadChildren: () =>
      import('./pages/attendance-details/attendance-details.module').then(
        (m) => m.AttendanceDetailsPageModule
      ),
  },
  {
    path: 'fees',
    loadChildren: () =>
      import('./pages/fees/fees.module').then((m) => m.FeesPageModule),
  },
  {
    path: 'subjects',
    loadChildren: () =>
      import('./pages/subjects/subjects.module').then(
        (m) => m.SubjectsPageModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
  },
  {
    path: 'faculty',
    loadChildren: () =>
      import('./pages/faculty/faculty.module').then((m) => m.FacultyPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'database',
    loadChildren: () => import('./pages/database/database.module').then( m => m.DatabasePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: CustomPreloadingStrategyService,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
