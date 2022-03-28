import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Auth} from "aws-amplify";
import {Router} from "@angular/router";
import {noop} from "rxjs";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public verificationCodeErrorMessage: string
  public resetPasswordErrorMessage: string

  sendVerificationCodeForm: FormGroup = new FormGroup({
    email: new FormControl(),
  });

  resetPasswordForm: FormGroup = new FormGroup({
    confirmationCode: new FormControl(),
    newPassword: new FormControl(),
    confirmNewPassword: new FormControl(),
  });

  public verificationCodeSent: boolean

  constructor(private router: Router) {
    this.verificationCodeSent = false;
    this.verificationCodeErrorMessage = '';
    this.resetPasswordErrorMessage = '';
  }

  ngOnInit(): void {
  }

  public sendVerificationCode(): void {
    this.verificationCodeErrorMessage = ''
    Auth.forgotPassword(this.sendVerificationCodeForm.controls['email'].value)
      .then(() => {
        this.verificationCodeSent = true
      })
      .catch(err => {
        console.log('Error while sending verification flow', err)
        this.verificationCodeErrorMessage = 'Please contact your system administrator'
      });
  }

  public resetPassword(): void {
    this.resetPasswordErrorMessage = '';
    if (this.resetPasswordForm.controls['newPassword'].value !== this.resetPasswordForm.controls['confirmNewPassword'].value) {
      this.resetPasswordErrorMessage = 'Passwords mismatch. Please try again'
      return
    }

    Auth.forgotPasswordSubmit(this.sendVerificationCodeForm.controls['email'].value,
      this.resetPasswordForm.controls['confirmationCode'].value, this.resetPasswordForm.controls['newPassword'].value)
      .then(() => {
        this.router.navigate(['home']).then(noop)
      })
      .catch(err => {
        console.log('Error while password reset', err)
        this.resetPasswordErrorMessage = err;
      });
  }
}
