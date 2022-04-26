import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {noop} from "rxjs";
import {Auth} from "aws-amplify";
import {AuthService} from "../services/auth.service";
import {
  ADD_USER_PAGE,
  ADMINISTRATORS_GROUP,
  EMPTY_STRING,
  FORGOT_PASSWORD_PAGE, GOT_IT_ACTION,
  HOME_PAGE,
  RESET_PASSWORD_PAGE
} from "../constants";
import {SnackService} from "../services/snack.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    username: new FormControl(EMPTY_STRING, Validators.required),
    password: new FormControl(EMPTY_STRING, Validators.required),
  });

  public disableSubmitButton = false

  constructor(private router: Router,
              private authService: AuthService,
              private snackService: SnackService,
              private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
  }

  public signIn(container: HTMLElement): void {
    if (this.form.valid) {
      this.disableSubmitButton = true
      this.spinner.show().then(noop)
      Auth.signIn(this.form.controls['username'].value, this.form.controls['password'].value).then((session: any) => {
        if (session) {
          switch (session.challengeName) {
            case "NEW_PASSWORD_REQUIRED":
              localStorage.setItem("username", this.form.controls['username'].value)
              this.spinner.hide().then(noop)
              this.router.navigate([RESET_PASSWORD_PAGE]).then(noop)
              break
            default:
              this.authService.getUserGroup().subscribe(userGroup => {
                this.spinner.hide().then(noop)
                if (ADMINISTRATORS_GROUP === userGroup) {
                  this.router.navigate([ADD_USER_PAGE]).then(noop)
                } else {
                  this.router.navigate([HOME_PAGE]).then(noop)
                }
              })
              this.spinner.hide().then(noop)
              this.router.navigate([HOME_PAGE]).then(noop)
          }
        }
      }, (error) => {
        console.log("Sign in error : ", error)
        this.spinner.hide().then(noop)
        this.disableSubmitButton = false
        this.snackService.displaySnack(container, error, GOT_IT_ACTION)
      })
    }

  }

  public forgotPassword(): void {
    this.router.navigate([FORGOT_PASSWORD_PAGE]).then(noop)
  }

}
