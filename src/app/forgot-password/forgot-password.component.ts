import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Auth} from "aws-amplify";
import {Router} from "@angular/router";
import {noop} from "rxjs";
import {EMPTY_STRING, GOT_IT_ACTION, HOME_PAGE} from "../constants";
import {SnackService} from "../services/snack.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public disableSendVerificationCodeButton = false
  public disableResetPasswordButton = false


  public sendVerificationCodeForm: FormGroup = new FormGroup({
    email: new FormControl(EMPTY_STRING, Validators.required),
  });

  public resetPasswordForm: FormGroup = new FormGroup({
    confirmationCode: new FormControl(EMPTY_STRING, Validators.required),
    newPassword: new FormControl(EMPTY_STRING, Validators.required),
    confirmNewPassword: new FormControl(EMPTY_STRING, Validators.required)
  });

  public verificationCodeSent: boolean

  constructor(private router: Router,
              private snackService: SnackService) {
    this.verificationCodeSent = false;
  }

  ngOnInit(): void {
  }

  public sendVerificationCode(container: HTMLElement): void {
    if (this.sendVerificationCodeForm.controls['email'].valid) {
      this.disableSendVerificationCodeButton = true
      Auth.forgotPassword(this.sendVerificationCodeForm.controls['email'].value)
        .then(() => {
          this.verificationCodeSent = true
        })
        .catch(err => {
          console.log('Error while sending verification flow', err)
          this.disableSendVerificationCodeButton = false
          this.snackService.displaySnack(container, 'Please contact your system administrator', GOT_IT_ACTION)
        });
    }
  }

  public resetPassword(container: HTMLElement): void {
    if (this.resetPasswordForm.valid) {
      if (this.resetPasswordForm.controls['newPassword'].value !== this.resetPasswordForm.controls['confirmNewPassword'].value) {
        this.snackService.displaySnack(container, 'Passwords mismatch. Please try again', GOT_IT_ACTION)
        return
      }

      this.disableResetPasswordButton = true
      Auth.forgotPasswordSubmit(this.sendVerificationCodeForm.controls['email'].value,
        this.resetPasswordForm.controls['confirmationCode'].value, this.resetPasswordForm.controls['newPassword'].value)
        .then(() => {
          this.router.navigate([HOME_PAGE]).then(noop)
        })
        .catch(err => {
          console.log('Error while password reset', err)
          this.snackService.displaySnack(container, err, GOT_IT_ACTION)
          this.disableResetPasswordButton = false
        });
    }
  }

}
