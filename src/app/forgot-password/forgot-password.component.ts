import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

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
    code: new FormControl(''),
    newPassword: new FormControl(''),
    confirmNewPassword: new FormControl(''),
  });

  public verificationCodeSent: boolean

  constructor() {
    this.verificationCodeSent = false
  }

  ngOnInit(): void {
  }

  public sendVerificationCode(): void {
    this.verificationCodeSent = true
  }

  public resetPassword(): void {
  }
}
