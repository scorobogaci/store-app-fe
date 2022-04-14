import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ApiService} from "../services/api.service";
import {AddUserRequest, Company} from "../types";
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from "@angular/material/snack-bar";
import {AppOverlayContainer} from "../services/app-overlay-container";
import {CLOSE_ACTION, EMPTY_STRING, GOT_IT_ACTION, NEW_USER_ONBOARDED_SUCCESS_MESSAGE} from "../constants";
import {NgxSpinnerService} from "ngx-spinner";
import {noop} from "rxjs";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  private snackbarRef: MatSnackBarRef<SimpleSnackBar> | undefined;
  private gotItAction = GOT_IT_ACTION
  private closeAction = CLOSE_ACTION

  // https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
  private companyIdentifierRegex = new RegExp('^((?!xn--)(?!.*-s3alias)[a-z0-9][a-z0-9-]{1,61}[a-z0-9])$')
  public blockSubmitButton = false
  public displayNewCompanyCreationInput = false

  public form: FormGroup = new FormGroup({
    email: new FormControl(EMPTY_STRING, [Validators.required]),
    username: new FormControl(EMPTY_STRING,),
    companySelect: new FormControl(EMPTY_STRING, [Validators.required]),
    companyAlias: new FormControl(EMPTY_STRING, [Validators.required]),
    isCompanyAdministrator: new FormControl(false),
    companyIdentifier: new FormControl(EMPTY_STRING, [Validators.required, Validators.pattern(this.companyIdentifierRegex)])
  });

  public companies: Company[] = []

  constructor(private authService: AuthService,
              private apiService: ApiService,
              private snackBar: MatSnackBar,
              private spinner: NgxSpinnerService,
              private appOverlayContainer: AppOverlayContainer) {
  }

  ngOnInit(): void {
    this.spinner.show().then(noop)
    this.apiService.getCompanies().subscribe(
      response => {
        this.companies = response.companies
        this.spinner.hide().then(noop)
      },
      error => {
        this.spinner.hide().then(noop)
        console.log('error : ', error)
      })

    this.form.get('companySelect')!.valueChanges.subscribe(value => {
      this.displayNewCompanyCreationInput = 'new' === value;
      if (value !== 'new') {
        this.form.controls['companyAlias'].clearValidators()
        this.form.controls['companyAlias'].updateValueAndValidity();
        this.form.controls['companyIdentifier'].clearValidators()
        this.form.controls['companyIdentifier'].updateValueAndValidity();
      } else {
        this.form.controls['companyAlias'].setValidators(Validators.required)
        this.form.controls['companyAlias'].updateValueAndValidity();
        this.form.controls['companyIdentifier'].setValidators([Validators.required, Validators.pattern(this.companyIdentifierRegex)])
        this.form.controls['companyIdentifier'].updateValueAndValidity();
      }
    })
  }

  public addUser(container: HTMLElement): void {

    if (!this.form.valid) {
      return
    }

    let addUserRequest: AddUserRequest;
    if (this.form.controls['companySelect'].value !== 'new') {
      addUserRequest = {
        email: this.form.controls['email'].value,
        companyAlias: this.form.controls['companyAlias'].value,
        isNewCompany: this.form.controls['companySelect'].value === 'new',
        isCompanyAdministrator: this.form.controls['isCompanyAdministrator'].value,
        companyIdentifier: this.form.controls['companySelect'].value,
        username: this.form.controls['username'].value
      }
    } else {
      addUserRequest = {
        email: this.form.controls['email'].value,
        companyAlias: this.form.controls['companyAlias'].value,
        isNewCompany: this.form.controls['companySelect'].value === 'new',
        isCompanyAdministrator: this.form.controls['isCompanyAdministrator'].value,
        companyIdentifier: this.form.controls['companyIdentifier'].value,
        username: this.form.controls['username'].value
      }
    }

    this.blockSubmitButton = true
    this.spinner.show().then(noop)
    this.apiService.addUser(addUserRequest).subscribe(
      () => {
        this.spinner.hide().then(noop)
        this.displaySnack(container, NEW_USER_ONBOARDED_SUCCESS_MESSAGE, this.closeAction)
      },
      error => {
        this.spinner.hide().then(noop)
        this.blockSubmitButton = false
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
