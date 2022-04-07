import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {noop} from "rxjs";
import {Auth} from "aws-amplify";
import {CognitoUserSession} from "amazon-cognito-identity-js";
import {AuthService} from "../services/auth.service";
import {ADD_USER_PAGE, ADMINISTRATORS_GROUP, FORGOT_PASSWORD_PAGE, HOME_PAGE, RESET_PASSWORD_PAGE} from "../constants";
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from "@angular/material/snack-bar";
import {AppOverlayContainer} from "../services/app-overlay-container";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private snackbarRef: MatSnackBarRef<SimpleSnackBar> | undefined;
  form: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  constructor(private router: Router,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private appOverlayContainer: AppOverlayContainer) {
  }

  ngOnInit(): void {
  }

  public signIn(container: HTMLElement): void {
    Auth.signIn(this.form.controls['username'].value, this.form.controls['password'].value).then((session: any) => {
      if (session) {
        switch (session.challengeName) {
          case "NEW_PASSWORD_REQUIRED":
            localStorage.setItem("username", this.form.controls['username'].value)
            this.router.navigate([RESET_PASSWORD_PAGE]).then(noop)
            break
          default:
            this.authService.getUserGroups().subscribe(userGroups => {
              if (userGroups.length > 0 && userGroups.includes(ADMINISTRATORS_GROUP)) {
                this.router.navigate([ADD_USER_PAGE]).then(noop)
              } else {
                this.router.navigate([HOME_PAGE]).then(noop)
              }
            })
        }
      }
    }, (error) => {
      console.log("Sign in error : ", error)
      this.displaySnack(container, error, 'Got It')
    })

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

  public forgotPassword(): void {
    this.router.navigate([FORGOT_PASSWORD_PAGE]).then(noop)
  }

}
