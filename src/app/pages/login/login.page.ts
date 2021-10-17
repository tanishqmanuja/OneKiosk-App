import { AfterViewInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthData, AuthService } from 'src/app/services/auth.service';
import { Keyboard, KeyboardInfo } from '@capacitor/keyboard';
import { Router } from '@angular/router';
import { isPlatform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements AfterViewInit {
  authData: AuthData = null;
  loggedAuthData: AuthData = null;
  isAuthCorrect = false;
  webkioskForm: FormGroup;
  isCheckNeeded: Observable<boolean>;
  checking = false;

  keyboardHeight = 0;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
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

  ngAfterViewInit() {
    if (isPlatform('android')) {
      Keyboard.addListener('keyboardWillShow', (info: KeyboardInfo) => {
        this.keyboardHeight = info.keyboardHeight;
      });

      Keyboard.addListener('keyboardWillHide', () => {
        this.keyboardHeight = 0;
      });
    }
  }

  async checkAuth() {
    this.checking = true;
    await this.closeKeyboard();
    const authData = this.webkioskForm.value;
    await this.authService.saveAuthData(authData);
    this.isAuthCorrect = (await this.authService.login())?.isAuthenticated;
    await this.authService.saveAuthData(this.authData);
    if (this.isAuthCorrect) {
      this.loggedAuthData = authData;
      await this.saveAuth();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
    this.checking = false;
  }

  async closeKeyboard() {
    if (isPlatform('android')) {
      if (this.keyboardHeight > 0) {
        await Keyboard.hide().catch();
      }
    }
  }

  async saveAuth() {
    this.authData = this.loggedAuthData;
    await this.authService.saveAuthData(this.authData);
    this.webkioskForm.updateValueAndValidity();
  }
}
