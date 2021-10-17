import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  TimetableItem,
  TimetableService,
} from 'src/app/services/timetable.service';
import { days } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  cls: TimetableItem;
  days = days.slice(1);
  times = [9, 10, 11, 12, 13, 14, 15, 16];
  types = ['lecture', 'tutorial', 'practical'];

  form: FormGroup;

  get selectedTime() {
    return this.form.get('time').value;
  }

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private timetableService: TimetableService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      day: [
        this.cls?.day || days[new Date().getDay()] || this.days[0],
        Validators.required,
      ],
      time: [this.cls?.time || 9, Validators.required],
      type: [this.cls?.type || 'lecture', Validators.required],
      duration: [this.cls?.duration || 1, Validators.required],
      name: [
        this.cls?.subject.acronym || '',
        Validators.compose([
          Validators.minLength(2),
          Validators.maxLength(7),
          Validators.required,
        ]),
      ],
    });
  }

  formatTime(time: number) {
    if (time < 12) return [time, 'am'];
    if (time > 12) return [time - 12, 'pm'];
    return [time, 'pm'];
  }

  increment() {
    if (this.selectedTime < this.times[this.times.length - 1])
      this.form.controls.time.setValue(this.selectedTime + 1);
  }

  decrement() {
    if (this.selectedTime > this.times[0])
      this.form.controls.time.setValue(this.selectedTime - 1);
  }

  correctedFormData() {
    const data = this.form.value;
    data.subject = {
      name: data.name,
      acronym: data.name,
    };
    delete data.name;
    return data;
  }

  async save() {
    if (this.form.valid) {
      if (this.cls) {
        await this.timetableService.updateClass(
          this.cls.day,
          this.cls.time,
          this.correctedFormData()
        );
      } else {
        await this.timetableService.addClass(this.correctedFormData());
      }
    }
    this.modalController.dismiss();
  }

  cancel() {
    this.modalController.dismiss();
  }
}
