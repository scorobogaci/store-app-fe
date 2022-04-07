import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ApiService} from "../services/api.service";
import {AddUserRequest} from "../types";
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from "@angular/material/snack-bar";
import {AppOverlayContainer} from "../services/app-overlay-container";
import {EMPTY_STRING} from "../constants";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  private snackbarRef: MatSnackBarRef<SimpleSnackBar> | undefined;
  private gotItAction = 'Got it!'
  private closeAction = 'Close'
  public companyRegex = new RegExp('^[a-zA-Z0-9_ .-]*$')
  public blockSubmitButton = false
  public displayNewCompanyCreationInput = false

  form: FormGroup = new FormGroup({
    email: new FormControl(EMPTY_STRING, [Validators.required]),
    username: new FormControl(EMPTY_STRING, [Validators.required]),
    company: new FormControl(EMPTY_STRING, [Validators.required]),
    existingCompany: new FormControl(EMPTY_STRING, [Validators.required]),
    isCompanyAdministrator: new FormControl(false),
  });

  companies: string[] = []

  constructor(private authService: AuthService,
              private apiService: ApiService,
              private snackBar: MatSnackBar,
              private appOverlayContainer: AppOverlayContainer) {
  }

  ngOnInit(): void {
    this.apiService.getCompanies().subscribe(
      response => {
        this.companies = response.companies
      },
      error => console.log('error : ', error))

    this.form.get('existingCompany')!.valueChanges.subscribe(value => {
      this.displayNewCompanyCreationInput = 'new_company' === value;
    })
  }

  public addUser(container: HTMLElement): void {

    if (EMPTY_STRING !== this.form.controls['company'].value) {
      this.form.controls['existingCompany'].clearValidators()
      this.form.controls['existingCompany'].updateValueAndValidity();
    }

    if (this.form.controls['existingCompany'].value !== 'new_company') {
      this.form.controls['company'].clearValidators()
      this.form.controls['company'].updateValueAndValidity();
    }

    if (!this.form.valid) {
      return
    }

    const addUserRequest: AddUserRequest = {
      email: this.form.controls['email'].value,
      username: this.form.controls['username'].value,
      company: this.form.controls['company'].value,
      isNewCompany: true,
      isCompanyAdministrator: this.form.controls['isCompanyAdministrator'].value
    }

    if (this.form.controls['existingCompany'].value === 'new_company') {
      addUserRequest.isNewCompany = true
      addUserRequest.company = this.form.controls['company'].value
    } else {
      addUserRequest.isNewCompany = false
      addUserRequest.company = this.form.controls['existingCompany'].value
    }

    this.blockSubmitButton = true
    this.apiService.addUser(addUserRequest).subscribe(
      () => {
        this.displaySnack(container, "Congratulations! New user has been onboarded", this.closeAction)
      },
      error => {
        this.blockSubmitButton = false
        console.log("error : ", error)
        this.displaySnack(container, error.error.errorMessage, this.gotItAction)
      }
    )
  }

  public logout(): void {
    this.authService.signOut()
  }

  private displaySnack(overlayContainerWrapper: HTMLElement, message: string, action: string): void {
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

      this.snackbarRef!.onAction().subscribe(() => {
        if (action === this.closeAction) {
          AddUserComponent.reloadPage()
        }
      })
    }, 100);

  }

  private static reloadPage(): void {
    location.reload()
  }

}
