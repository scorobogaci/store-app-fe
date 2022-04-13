import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Auth} from "aws-amplify";
import {noop} from "rxjs";
import {ApiService} from "../services/api.service";
import {DeleteFileRequest, File} from "../types";
import {AuthService} from "../services/auth.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogModel, ConfirmDialogComponent} from "../components/dialog-component/confirm-dialog.component";
import {take} from "rxjs/operators";
import {LOGIN_PAGE, SLASH, UPLOAD_BUCKET_ACL, UPLOAD_CONTENT_DISPOSITION, UPLOAD_CONTENT_TYPE} from "../constants";
import {NgxSpinnerService} from "ngx-spinner";
import {S3} from "aws-sdk";
import {flatMap} from "rxjs/internal/operators";
import {UploadDialogComponent} from "../components/upload-component/upload-dialog.component";

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
  private uploadDialogRef: MatDialogRef<UploadDialogComponent> | undefined

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

    this.authService.getNickName().subscribe(username => {
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

  public deleteFile(key: string, fileName: string): void {

    const dialogMessage = "Delete ".concat(fileName).concat(' ?')
    const dialogData = new ConfirmDialogModel(this.dialogTitle, dialogMessage);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const deleteFileRequest: DeleteFileRequest = {key: key}
        this.apiService.deleteFile(deleteFileRequest).pipe(take(1)).subscribe(response => {
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
      reader.readAsArrayBuffer(inputNode.files[0]);
      const fileName = inputNode.files[0].name
      reader.onload = (e: any) => {
        this.uploadDialogRef = this.dialog.open(UploadDialogComponent, {
          data: {
            title: 'Uploading ...',
            fileName: fileName,
            progress: 0
          },
          width: '500px',
          height: '250px',
          disableClose: true
        })

        this.uploadDialogRef.afterClosed().subscribe(value => {
          // perform logic to cancel upload
          console.log("dialog closed with value : ", value)
        })

        this.uploadFile(e.target.result, fileName).then(noop)
      };
    }
  }

  public logout(): void {
    Auth.signOut().then(
      () => this.router.navigate([LOGIN_PAGE]).then(noop),
      (error) => console.log('Error to sign out the user : ', error)
    );
  }

  public async uploadFile(file: any, filename: string): Promise<void> {
    Auth.currentCredentials().then((credentials) => {
      this.authService.getUserGroup().pipe(take(1), flatMap(userGroup => {
        this.authService.getUsername().pipe(take(1)).subscribe(username => {
          const s3Client = new S3({
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            sessionToken: credentials.sessionToken
          })
          const params = {
            Bucket: userGroup,
            Key: username.concat(SLASH).concat(filename),
            ACL: UPLOAD_BUCKET_ACL,
            ContentType: UPLOAD_CONTENT_TYPE,
            ContentDisposition: UPLOAD_CONTENT_DISPOSITION,
            Body: file
          }

          s3Client.upload(params).on('httpUploadProgress', (event) => {
            console.log(event.loaded + ' of ' + event.total + ' Bytes');
            if (this.uploadDialogRef && this.uploadDialogRef.componentInstance) {
              this.uploadDialogRef.componentInstance.data.progress = (100 * event.loaded) / event.total
            }
          }).send((err: any, data: any) => {
            if (err) {
              console.log('There was an error uploading your file: ', err);
              return false;
            }
            console.log('Successfully uploaded file.', data);
            return true;
          });
        })
        return new Promise(() => {
        })
      })).pipe(take(1)).subscribe()

    }, error => {
      console.log("Error while getting AWS Temporary credentials : ", error)
    })
  }

}
