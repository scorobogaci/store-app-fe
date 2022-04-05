import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ApiService} from "../services/api.service";
import {AddUserRequest} from "../types";
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from "@angular/material/snack-bar";
import {AppOverlayContainer} from "../services/app-overlay-container";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  snackbarRef: MatSnackBarRef<SimpleSnackBar> | undefined;
  successConfirmationMessage = 'Nice! User has been onboarded'
  displaySuccessConfirmationMessage = false
  emptyString = ''

  private formInitialValues: any

  form: FormGroup = new FormGroup({
    email: new FormControl(this.emptyString, [Validators.required]),
    username: new FormControl(this.emptyString, [Validators.required]),
    company: new FormControl(this.emptyString, [Validators.required]),
    existingCompany: new FormControl(this.emptyString, [Validators.required]),
  });

  companies: string[] = []

  constructor(private authService: AuthService, private apiService: ApiService, private snackBar: MatSnackBar, private appOverlayContainer: AppOverlayContainer) {
    this.formInitialValues = this.form.value
  }

  ngOnInit(): void {
    this.apiService.getCompanies().subscribe(
      response => {
        this.companies = response.companies
      },
      error => console.log('error : ', error))
  }

  displaySnack(
    overlayContainerWrapper: HTMLElement,
    message: string,
    action: string
  ): void {
    if (overlayContainerWrapper === null) {
      return;
    }

    if (this.snackbarRef) {
      this.snackbarRef.dismiss();
    }

    setTimeout(() => {
      this.appOverlayContainer.appendToCustomWrapper(overlayContainerWrapper);

      this.snackbarRef = this.snackBar.open(message, action, {
        duration: 0
      });
    }, 100);
  }

  public addUser(container: HTMLElement): void {
    this.displaySnack(container, 'Error message or success message to be displayed in here', 'Close')

    if (this.emptyString !== this.form.controls['company'].value) {
      this.form.controls['existingCompany'].clearValidators()
      this.form.controls['existingCompany'].updateValueAndValidity();
    }

    if (this.form.controls['existingCompany'].value.length > 1) {
      this.form.controls['company'].clearValidators()
      this.form.controls['company'].updateValueAndValidity();
    }

    if (!this.form.valid) {
      return
    }

    console.log("form is valid : ")


    const addUserRequest: AddUserRequest = {
      email: this.form.controls['email'].value,
      username: this.form.controls['email'].value,
      company: this.form.controls['company'].value,
      isNew: false
    }

    // this.apiService.addUser(addUserRequest).subscribe(
    //   response => {
    //     console.log("response : ", response)
    //   },
    //   error => {
    //     console.log("error : ", error)
    //   }
    // )

    this.displaySuccessConfirmationMessage = true
    AddUserComponent.reloadPage()
  }

  private static reloadPage(): void {
    location.reload()
  }

  public logout(): void {
    this.authService.signOut()
  }

}
