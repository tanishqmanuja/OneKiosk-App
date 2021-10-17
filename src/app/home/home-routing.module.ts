import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'attendance',
        data: {preload: true},
        loadChildren: () => import('../pages/attendance/attendance.module').then( m => m.AttendancePageModule)
      },
      {
        path: 'report',
        data: {preload: true},
        loadChildren: () => import('../pages/report/report.module').then( m => m.ReportPageModule)
      },
      {
        path: 'dashboard',
        data: {preload: true},
        loadChildren: () => import('../pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: 'timetable',
        data: {preload: true},
        loadChildren: () => import('../pages/timetable/timetable.module').then( m => m.TimetablePageModule)
      },
      {
        path: 'others',
        loadChildren: () => import('../pages/others/others.module').then( m => m.OthersPageModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
