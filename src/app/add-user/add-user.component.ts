import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ApiService} from "../services/api.service";
import {AddUserRequest} from "../types";

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

    this.apiService.getCompanies().subscribe(
      response => {
        this.companies = response.companies
      },
      error => console.log('error : ', error))
  }

  public addUser(): void {

    console.log("add user fired")
    const addUserRequest: AddUserRequest = {
      email: 'zulib@gmail.com',
      username: 'zulib',
      isNew: true,
      company: 'zulib'
    }

    this.apiService.addUser(addUserRequest).subscribe(
      response => {
        console.log("response : ", response)
      },
      error => {
        console.log("error : ", error)
      }
    )

    console.log()
    this.displaySuccessConfirmationMessage = true
    this.form.reset()
  }

  public logout(): void {
    this.authService.signOut()
  }

}
