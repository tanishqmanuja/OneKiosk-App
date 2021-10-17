import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthData, AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-webkiosk',
  templateUrl: './webkiosk.page.html',
  styleUrls: ['./webkiosk.page.scss'],
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
export class WebkioskPage implements OnInit {
  authData: AuthData = null;
  loggedAuthData: AuthData = null;
  isAuthCorrect = false;
  webkioskForm: FormGroup;
  isCheckNeeded: Observable<boolean>;
  checking = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.authData = this.authService.getAuthData();
    this.webkioskForm = this.formBuilder.group({
      enroll: [
        this.authData?.enroll || '',
        Validators.compose([
          Validators.pattern('^[0-9]{8}$'),
          Validators.required,
        ]),
      ],
      dob: [
        this.authData?.dob || '',
        Validators.compose([
          Validators.pattern('^[0-9]{2}/[0-9]{2}/[0-9]{4}$'),
          Validators.required,
        ]),
      ],
      pass: [this.authData?.pass || '', Validators.required],
    });
    this.isCheckNeeded = this.webkioskForm.valueChanges.pipe(
      map(
        (val) =>
          !(
            val.enroll === this.authData?.enroll &&
            val.dob === this.authData?.dob &&
            val.pass === this.authData?.pass
          )
      )
    );
  }

  ngOnInit() {}

  async checkAuth() {
    this.checking = true;
    const authData = this.webkioskForm.value;
    await this.authService.saveAuthData(authData);
    this.isAuthCorrect = (await this.authService.login())?.isAuthenticated;
    await this.authService.saveAuthData(this.authData);
    if (this.isAuthCorrect) this.loggedAuthData = authData;
    this.checking = false;
  }

  async saveAuth() {
    this.authData = this.loggedAuthData;
    await this.authService.saveAuthData(this.authData);
    this.webkioskForm.updateValueAndValidity();
  }
}
