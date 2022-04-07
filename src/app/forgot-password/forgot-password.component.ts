import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Auth} from "aws-amplify";
import {Router} from "@angular/router";
import {noop} from "rxjs";
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from "@angular/material/snack-bar";
import {AppOverlayContainer} from "../services/app-overlay-container";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  private snackbarRef: MatSnackBarRef<SimpleSnackBar> | undefined;
  private emptyString = ''
  public verificationCodeErrorMessage: string
  public resetPasswordErrorMessage: string

  sendVerificationCodeForm: FormGroup = new FormGroup({
    email: new FormControl(this.emptyString, Validators.required),
  });

  resetPasswordForm: FormGroup = new FormGroup({
    confirmationCode: new FormControl(this.emptyString, Validators.required),
    newPassword: new FormControl(this.emptyString, Validators.required),
    confirmNewPassword: new FormControl(this.emptyString, Validators.required),
  });

  public verificationCodeSent: boolean

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private appOverlayContainer: AppOverlayContainer) {
    this.verificationCodeSent = false;
    this.verificationCodeErrorMessage = '';
    this.resetPasswordErrorMessage = '';
  }

  ngOnInit(): void {
  }

  public sendVerificationCode(): void {
    this.verificationCodeErrorMessage = ''
    if (this.sendVerificationCodeForm.controls['email'].valid) {
      Auth.forgotPassword(this.sendVerificationCodeForm.controls['email'].value)
        .then(() => {
          this.verificationCodeSent = true
        })
        .catch(err => {
          console.log('Error while sending verification flow', err)
          this.verificationCodeErrorMessage = 'Please contact your system administrator'
        });
    }
  }

  public resetPassword(container: HTMLElement): void {
    if (this.resetPasswordForm.valid) {
      if (this.resetPasswordForm.controls['newPassword'].value !== this.resetPasswordForm.controls['confirmNewPassword'].value) {
        this.displaySnack(container, 'Passwords mismatch. Please try again', 'Got It')
        return
      }

      Auth.forgotPasswordSubmit(this.sendVerificationCodeForm.controls['email'].value,
        this.resetPasswordForm.controls['confirmationCode'].value, this.resetPasswordForm.controls['newPassword'].value)
        .then(() => {
          this.router.navigate(['home']).then(noop)
        })
        .catch(err => {
          console.log('Error while password reset', err)
          this.displaySnack(container, err, 'Got It')
        });
    }
  }

  private displaySnack(overlayContainerWrapper: HTMLElement, message: string, action: string): void {
    if (overlayContainerWrapper === null) {
      return;
    }

    if (this.snackbarRef) {
      this.snackbarRef.dismiss();
    }

    setTimeout(() => {
      this.appOverlayContainer.appendToCustomWrapper(overlayContainerWrapper);

      this.snackbarRef = this.snackBar.open(message, action, {
        duration: 0
      });
    }, 100);

  }
}
