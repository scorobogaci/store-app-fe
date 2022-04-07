import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Auth} from "aws-amplify";
import {Router} from "@angular/router";
import {noop} from "rxjs";
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from "@angular/material/snack-bar";
import {AppOverlayContainer} from "../services/app-overlay-container";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private emptyString = ''
  private snackbarRef: MatSnackBarRef<SimpleSnackBar> | undefined;
  form: FormGroup = new FormGroup({
    previousPassword: new FormControl(this.emptyString, Validators.required),
    newPassword: new FormControl(this.emptyString, Validators.required),
    confirmNewPassword: new FormControl(this.emptyString, Validators.required),
  });

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private appOverlayContainer: AppOverlayContainer) {
  }

  ngOnInit(): void {
  }

  public resetPassword(container: HTMLElement): void {

    if (this.form.valid) {
      if (this.form.controls['newPassword'].value !== this.form.controls['confirmNewPassword'].value) {
        this.displaySnack(container, 'Passwords mismatch. Please try again', 'Got It')
        return
      }
      Auth.signIn(localStorage.getItem("username")!, this.form.controls['previousPassword'].value)
        .then(user => {
          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            Auth.completeNewPassword(user, this.form.controls['newPassword'].value).then(() => {
              this.router.navigate(['home']).then(noop)
            }).catch(error => {
              console.log("Error on completing password reset", error);
              this.displaySnack(container, error, 'Got It')
            });
          } else {
            this.displaySnack(container, 'Please contact your system administrator', 'Got It')
          }
        }).catch(error => {
        console.log("Error on sign in", error);
        this.displaySnack(container, 'Please contact your system administrator', 'Got It')
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
