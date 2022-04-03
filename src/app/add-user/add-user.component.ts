import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ApiService} from "../services/api.service";

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

  companies: string[] = []

  constructor(private authService: AuthService, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.apiService.getCompanies().then(companies => {
      this.companies = companies
    })
  }

  public addUser(): void {
    this.displaySuccessConfirmationMessage = true
    this.form.reset()
  }

  public logout(): void {
    this.authService.signOut()
  }

}
