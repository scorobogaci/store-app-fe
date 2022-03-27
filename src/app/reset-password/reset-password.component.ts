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

  form: FormGroup = new FormGroup({
    previousPassword: new FormControl(''),
    newPassword: new FormControl(''),
    confirmNewPassword: new FormControl(''),
  });

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  public resetPassword(): void {
    Auth.signIn(localStorage.getItem("username")!, this.form.controls['previousPassword'].value)
      .then(user => {
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          Auth.completeNewPassword(user, this.form.controls['newPassword'].value).then(() => {
            this.router.navigate(['home']).then(noop)
          }).catch(error => {
            console.log("Error on completing new password", error);
          });
        } else {
          console.log("some other weird situation happened")
        }
      }).catch(error => {
      console.log("Error on sign in", error);
    });

  }

}
