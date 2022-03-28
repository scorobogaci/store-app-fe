import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {noop} from "rxjs";
import {Auth} from "aws-amplify";
import {CognitoUserSession} from "amazon-cognito-identity-js";

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

  constructor(private router: Router) {
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
            this.router.navigate(['reset-password']).then(noop)
            break
          default:
            this.router.navigate(['home']).then(noop)
        }
      }
    }, (error) => {
      this.errorMessage = error
      console.log("Sign in error : ", error)
    })

  }

  public forgotPassword(): void {
    this.router.navigate(['forgot-password']).then(noop)
  }

}
