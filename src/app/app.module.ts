import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {HomeComponent} from './home/home.component';
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./auth.interceptor";
import {AddUserComponent} from './add-user/add-user.component';
import {MatSelectModule} from "@angular/material/select";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {OverlayContainer} from "@angular/cdk/overlay";
import {AppOverlayContainer} from "./services/app-overlay-container";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {DialogComponent} from "./components/dialog-component/dialog.component";
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetPasswordComponent,
    HomeComponent,
    ForgotPasswordComponent,
    AddUserComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatSelectModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatTableModule,
    MatDialogModule,
  ],
  exports: [
    MatInputModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: OverlayContainer, useExisting: AppOverlayContainer
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule {
}
