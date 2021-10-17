import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TimetableData,
  TimetableItem,
  TimetableService,
} from 'src/app/services/timetable.service';
import { days } from 'src/app/utilities/utilities';

import { SupabaseService } from 'src/app/services/supabase.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { EditComponent } from './edit/edit.component';
import { animations } from './timetable.anim';
import { ImportComponent } from './import/import.component';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.page.html',
  styleUrls: ['./timetable.page.scss'],
  animations,
})
export class TimetablePage implements OnInit {
  selectedIndex = new BehaviorSubject<number>(new Date().getDay());
  timetable$: Observable<TimetableData>;
  listOpen = false;

  constructor(
    private timetableService: TimetableService,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private supabase: SupabaseService
  ) {}

  ngOnInit() {
    this.timetable$ = combineLatest([
      this.timetableService.getTimetable(),
      this.selectedIndex,
    ]).pipe(
      map(([timetable, selectedIndex]) =>
        timetable
          .filter((item) => item.day === days[selectedIndex])
          .sort((a, b) => a.time - b.time)
      )
    );
  }

  get selectedDay() {
    return days[this.selectedIndex.value];
  }

  changeSelected(next?: boolean) {
    let index = this.selectedIndex.value;
    if (next) index++;
    else index--;

    if (index > days.length - 1) index = 0;
    if (index < 0) index = days.length - 1;
    this.selectedIndex.next(index);
  }

  formatTime(time: number) {
    if (time < 12) return time + ' am';
    if (time > 12) return time - 12 + ' pm';
    return time + ' pm';
  }

  async openMenu(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuComponent,
      cssClass: 'popover-menu',
      event: ev,
      translucent: true,
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', data);

    if (data?.action === 'import') this.openImport();
    if (data?.action === 'add') this.openEdit();
  }

  async openEdit(cls?: TimetableItem) {
    const modal = await this.modalController.create({
      component: EditComponent,
      cssClass: 'modal-tt-edit',
      showBackdrop: false,
      componentProps: {
        cls,
      },
    });
    await modal.present();
  }

  async openImport() {
    const modal = await this.modalController.create({
      component: ImportComponent,
      cssClass: 'modal-tt-import',
      showBackdrop: false,
    });
    await modal.present();
  }

  removeClass(cls: TimetableItem) {
    this.timetableService.removeClass(cls.day, cls.time);
  }

  async handleOptionPressed(ev: string, cls: TimetableItem) {
    if (ev === 'edit') {
      await this.openEdit(cls);
    } else if (ev === 'delete') {
      this.removeClass(cls);
    }
  }
}
