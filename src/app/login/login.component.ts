import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {noop} from "rxjs";
import {Auth} from "aws-amplify";
import {CognitoUserSession} from "amazon-cognito-identity-js";
import {AuthService} from "../services/auth.service";
import {ADD_USER_PAGE, ADMINISTRATORS_GROUP, FORGOT_PASSWORD_PAGE, HOME_PAGE, RESET_PASSWORD_PAGE} from "../constants";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public errorMessage: string
  form: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  constructor(private router: Router, private authService: AuthService) {
    this.errorMessage = ''
  }

  ngOnInit(): void {
  }

  public signIn(): void {
    this.errorMessage = '';
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
      this.errorMessage = error
      console.log("Sign in error : ", error)
    })

  }

  public forgotPassword(): void {
    this.router.navigate([FORGOT_PASSWORD_PAGE]).then(noop)
  }

}
