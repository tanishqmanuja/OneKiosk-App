import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage.service';

export interface Endpoints {
  custom: boolean;
  primary: string;
  secondary: string;
}

@Component({
  selector: 'app-apis',
  templateUrl: './apis.page.html',
  styleUrls: ['./apis.page.scss'],
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
export class ApisPage implements OnInit {
  endpoints: Endpoints = {
    custom: false,
    primary: '',
    secondary: '',
  };
  apiForm: FormGroup;
  isSaveNeeded: Observable<boolean>;

  get customEndpoints() {
    return this.endpoints?.custom;
  }

  set customEndpoints(value: boolean) {
    this.endpoints.custom = value;
    if (!this.endpoints.custom) this.apiForm.disable();
    else this.apiForm.enable();
    this.apiForm.updateValueAndValidity();
    this.storage.set(this.storage.locations.endpoints, this.endpoints);
  }

  constructor(
    private formBuilder: FormBuilder,
    private storage: StorageService
  ) {
    const URLregex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.apiForm = this.formBuilder.group({
      primary: [
        this.endpoints?.primary,
        [Validators.pattern(URLregex), Validators.required],
      ],
      secondary: [
        this.endpoints?.secondary,
        [Validators.pattern(URLregex), Validators.required],
      ],
    });
    this.storage.get(this.storage.locations.endpoints).then((endpoints) => {
      if (endpoints) this.endpoints = endpoints;
      this.apiForm.setValue({
        primary: this.endpoints.primary || '',
        secondary: this.endpoints.secondary || '',
      });
      if (!this.endpoints.custom) this.apiForm.disable();
      else this.apiForm.enable();
      this.apiForm.updateValueAndValidity();
    });

    this.isSaveNeeded = this.apiForm.valueChanges.pipe(
      map(
        (val) =>
          !(
            val.primary === this.endpoints?.primary &&
            val.secondary === this.endpoints?.secondary
          )
      )
    );
  }

  ngOnInit() {}

  save() {
    this.endpoints.primary = this.apiForm.value?.primary || '';
    this.endpoints.secondary = this.apiForm.value?.secondary || '';

    this.storage.set(this.storage.locations.endpoints, this.endpoints);
  }
}
