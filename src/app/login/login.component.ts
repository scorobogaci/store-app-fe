import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {noop} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  public signIn(): void {
    console.log("logging in")
  }

  public forgotPassword(): void {
    this.router.navigate(['forgot-password']).then(noop)
  }

}
