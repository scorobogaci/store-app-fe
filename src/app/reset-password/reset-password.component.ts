import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Auth} from "aws-amplify";
import {Router} from "@angular/router";
import {noop} from "rxjs";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public passwordResetErrorMessage: string

  form: FormGroup = new FormGroup({
    previousPassword: new FormControl(''),
    newPassword: new FormControl(''),
    confirmNewPassword: new FormControl(''),
  });

  constructor(private router: Router) {
    this.passwordResetErrorMessage = '';
  }

  ngOnInit(): void {
  }

  public resetPassword(): void {
    this.passwordResetErrorMessage = '';

    if (this.form.controls['newPassword'].value !== this.form.controls['confirmNewPassword'].value) {
      this.passwordResetErrorMessage = 'Passwords mismatch. Please try again';
      return
    }
    Auth.signIn(localStorage.getItem("username")!, this.form.controls['previousPassword'].value)
      .then(user => {
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          Auth.completeNewPassword(user, this.form.controls['newPassword'].value).then(() => {
            this.router.navigate(['home']).then(noop)
          }).catch(error => {
            console.log("Error on completing password reset", error);
            this.passwordResetErrorMessage = error;
          });
        } else {
          this.passwordResetErrorMessage = 'Please contact your system administrator';
        }
      }).catch(error => {
      console.log("Error on sign in", error);
      this.passwordResetErrorMessage = 'Please contact your system administrator';
    });

  }

}
