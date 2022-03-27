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

  sendVerificationCodeForm: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  resetPasswordForm: FormGroup = new FormGroup({
    confirmationCode: new FormControl(''),
    newPassword: new FormControl(''),
    confirmNewPassword: new FormControl(''),
  });

  public verificationCodeSent: boolean

  constructor(private router: Router) {
    this.verificationCodeSent = false
  }

  ngOnInit(): void {
  }

  public sendVerificationCode(): void {
    Auth.forgotPassword(this.sendVerificationCodeForm.controls['email'].value)
      .then(data => {
        console.log('Verification code sent', data)
        this.verificationCodeSent = true
      })
      .catch(err => console.log('Error while sending verification flow', err));
  }

  public resetPassword(): void {
    Auth.forgotPasswordSubmit(this.sendVerificationCodeForm.controls['email'].value,
      this.resetPasswordForm.controls['confirmationCode'].value, this.resetPasswordForm.controls['newPassword'].value)
      .then(data => {
        console.log('Password reset', data)
        this.router.navigate(['home']).then(noop)
      })
      .catch(err => console.log('Error while password reset', err));
  }
}
