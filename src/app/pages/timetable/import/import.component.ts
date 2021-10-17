import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';
import { TimetableService } from 'src/app/services/timetable.service';

const BUCKET_TT = 'timetables';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  timetableList: Promise<any>;
  constructor(
    private supabase: SupabaseService,
    private timetableService: TimetableService,
    private modalController: ModalController
  ) {
    this.timetableList = this.supabase.fnWrapper(
      this.supabase.listFilesInBucket(BUCKET_TT) as any
    );
  }

  ngOnInit() {}

  async applyTimetable(path: string) {
    const { data, error } = await this.supabase.download(BUCKET_TT, path);
    if (data) {
      const json = JSON.parse(await data.text());
      await this.timetableService.setTimetable(json);
      this.close();
    }
  }

  close() {
    this.modalController.dismiss();
  }
}
