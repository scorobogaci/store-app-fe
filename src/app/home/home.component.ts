import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Auth} from "aws-amplify";
import {noop} from "rxjs";
import {ApiService} from "../services/api.service";
import {DeleteFileRequest, File} from "../types";
import {AuthService} from "../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogModel, DialogComponent} from "../components/dialog-component/dialog.component";
import {take} from "rxjs/operators";
import {LOGIN_PAGE} from "../constants";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'type', 'uploadTime', 'size', 'actions'];
  public dataSource: File[] = [];
  public username: string = ''
  public displayWelcomeUsername = ''
  public isCompanyAdministrator = false

  private dialogTitle = "You're about to delete a file from company's storage"
  private dialogMessage = "Are you sure you want to perform this action ?"

  constructor(private router: Router,
              private apiService: ApiService,
              private authService: AuthService,
              private spinner: NgxSpinnerService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.spinner.show().then(noop)
    this.authService.isCompanyAdministrator().subscribe(isCompanyAdministrator => {
      this.isCompanyAdministrator = isCompanyAdministrator
    }, error => {
      console.log('Error while checking if user is company administrator : ', error)
    })

    this.authService.getUsername().subscribe(username => {
      this.username = username
      if (this.username !== 'not_set') {
        this.displayWelcomeUsername = this.username
      }

    }, error => {
      console.log('Error while getting username : ', error)
    })

    this.apiService.getCompanyFiles().subscribe(response => {
      this.dataSource = response.companyFiles
      this.spinner.hide().then(noop)
    }, error => {
      console.log("Error on getting company files", error)
    })
  }

  public deleteFile(key: string): void {

    const dialogData = new ConfirmDialogModel(this.dialogTitle, this.dialogMessage, {
      okButtonText: 'Yes',
      cancelButtonText: 'No'
    });

    const dialogRef = this.dialog.open(DialogComponent, {
      data: dialogData
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const deleteFileRequest: DeleteFileRequest = {key: key}
        this.apiService.deleteFile(deleteFileRequest).pipe(take(1)).subscribe(response => {
          console.log("response : ", response)
          this.dataSource = this.dataSource.filter(element => element.key !== key)
        }, error => {
          console.log("Delete file error : ", error)
        })
      }
    })
  }

  public downloadFile(key: string): void {
    this.spinner.show().then(noop)
    this.apiService.downloadFile(key).pipe(take(1)).subscribe(url => {
      window.open(url, '_top')
      this.spinner.hide().then(noop)
    }, error => {
      console.log("Error on downloading the file : ", error)
    })
  }

  public onFileSelected(): void {
    const inputNode: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        console.log("e.target.result : ", e.target.result)
        //this.srcResult = e.target.result;
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  public logout(): void {
    Auth.signOut().then(
      () => this.router.navigate([LOGIN_PAGE]).then(noop),
      (error) => console.log('Error to sign out the user : ', error)
    );
  }

}
