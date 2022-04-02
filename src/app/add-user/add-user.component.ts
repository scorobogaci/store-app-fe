import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  successConfirmationMessage = 'Nice! User has been onboarded'
  displaySuccessConfirmationMessage = false

  form: FormGroup = new FormGroup({
    email: new FormControl(),
    username: new FormControl(),
    company: new FormControl(),
  });

  companies: string[] = ['Nike', 'Reebok', 'Jordan', 'Adidas', 'Puma', 'Under Armour']

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  public addUser(): void {
    this.displaySuccessConfirmationMessage = true
    this.form.reset()
    console.log("Adding user to cognito")
  }

  public logout(): void {
    this.authService.signOut()
  }

}
