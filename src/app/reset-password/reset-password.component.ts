import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Auth} from "aws-amplify";
import {Router} from "@angular/router";
import {noop} from "rxjs";
import {EMPTY_STRING, GOT_IT_ACTION, HOME_PAGE} from "../constants";
import {SnackService} from "../services/snack.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public disableSubmitButton = false
  form: FormGroup = new FormGroup({
    previousPassword: new FormControl(EMPTY_STRING, Validators.required),
    newPassword: new FormControl(EMPTY_STRING, Validators.required),
    confirmNewPassword: new FormControl(EMPTY_STRING, Validators.required),
  });

  constructor(private router: Router, private snackService: SnackService) {
  }

  ngOnInit(): void {
  }

  public resetPassword(container: HTMLElement): void {

    if (this.form.valid) {
      if (this.form.controls['newPassword'].value !== this.form.controls['confirmNewPassword'].value) {
        this.snackService.displaySnack(container, 'Passwords mismatch. Please try again', GOT_IT_ACTION)
        return
      }
      this.disableSubmitButton = true
      Auth.signIn(localStorage.getItem("username")!, this.form.controls['previousPassword'].value)
        .then(user => {
          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            Auth.completeNewPassword(user, this.form.controls['newPassword'].value).then(() => {
              this.router.navigate([HOME_PAGE]).then(noop)
            }).catch(error => {
              this.disableSubmitButton = false
              console.log("Error on completing password reset", error);
              this.snackService.displaySnack(container, error, GOT_IT_ACTION)
            });
          } else {
            this.disableSubmitButton = false
            this.snackService.displaySnack(container, 'Please contact your system administrator', GOT_IT_ACTION)
          }
        }).catch(error => {
        console.log("Error on sign in", error);
        this.disableSubmitButton = false
        this.snackService.displaySnack(container, 'Please contact your system administrator', GOT_IT_ACTION)
      });
    }
  }

}
