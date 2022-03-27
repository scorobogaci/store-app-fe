import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup = new FormGroup({
    newPassword: new FormControl(''),
    confirmNewPassword: new FormControl(''),
  });

  constructor() {
  }

  ngOnInit(): void {
  }

  public resetPassword(): void {
    console.log("reset password invoked")
  }

}
