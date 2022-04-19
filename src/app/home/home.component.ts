import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Auth} from "aws-amplify";
import {noop} from "rxjs";
import {ApiService} from "../services/api.service";
import {DeleteFileRequest, File} from "../types";
import {AuthService} from "../services/auth.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogModel, ConfirmDialogComponent} from "../components/dialog-component/confirm-dialog.component";
import {take} from "rxjs/operators";
import {
  AWS_TEMPORARY_CREDENTIALS_ERROR_MESSAGE, DELETE_COMPONENT_DIALOG_TITLE, EMPTY_STRING,
  LOGIN_PAGE,
  SLASH,
  UPLOAD_BUCKET_ACL, UPLOAD_COMPONENT_HEIGHT, UPLOAD_COMPONENT_TITLE,
  UPLOAD_COMPONENT_WIDTH,
  UPLOAD_CONTENT_DISPOSITION,
  UPLOAD_CONTENT_TYPE
} from "../constants";
import {NgxSpinnerService} from "ngx-spinner";
import {S3} from "aws-sdk";
import {flatMap} from "rxjs/internal/operators";
import {UploadDialogComponent} from "../components/upload-component/upload-dialog.component";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['name', 'type', 'uploadTime', 'size', 'actions'];
  public dataSource = new MatTableDataSource<File>([])
  public nickName: string = EMPTY_STRING;
  public displayWelcomeUsername = EMPTY_STRING;
  public isCompanyAdministrator = false;
  private uploadDialogRef: MatDialogRef<UploadDialogComponent> | undefined
  private username = EMPTY_STRING
  private uploadFileSize = 0
  private managedUpload: S3.ManagedUpload | undefined

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
      this.nickName = username
      if (this.nickName !== 'not_set') {
        this.displayWelcomeUsername = this.nickName
      }

    }, error => {
      console.log('Error while getting username : ', error)
    })

    this.apiService.getCompanyFiles().subscribe(response => {
      this.dataSource = new MatTableDataSource(response.companyFiles)
      this.dataSource.sort = this.sort;
      this.spinner.hide().then(noop)
    }, error => {
      console.log("Error on getting company files", error)
    })

    this.authService.getUsername().subscribe(username => {
      this.username = username
    })

  }

  public deleteFile(file: File): void {

    file.markedForDelete = true
    const dialogMessage = "Delete ".concat(file.name).concat(' ?')
    const dialogData = new ConfirmDialogModel(DELETE_COMPONENT_DIALOG_TITLE, dialogMessage);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: dialogData
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinner.show().then(noop)
        const deleteFileRequest: DeleteFileRequest = {key: file.key}
        this.apiService.deleteFile(deleteFileRequest).pipe(take(1)).subscribe(() => {
          this.dataSource = new MatTableDataSource<File>(this.dataSource?.data.filter(element => element.key !== file.key))
          this.spinner.hide().then(noop)
        }, error => {
          this.spinner.hide().then(noop)
          console.log("Delete file error : ", error)
        })
      } else {
        file.markedForDelete = false
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
      this.uploadFileSize = inputNode.files[0].size
      reader.onload = (e: any) => {
        this.uploadDialogRef = this.dialog.open(UploadDialogComponent, {
          data: {
            title: UPLOAD_COMPONENT_TITLE,
            fileName: fileName,
            progress: 0
          },
          width: UPLOAD_COMPONENT_WIDTH,
          height: UPLOAD_COMPONENT_HEIGHT,
          disableClose: true
        })

        this.uploadDialogRef.afterClosed().subscribe(value => {
          if (value === 'abort') {
            this.managedUpload!.abort()
          }
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

          this.managedUpload = s3Client.upload(params)

          this.managedUpload.on('httpUploadProgress', (event) => {
            // uncomment this line if you want to track the uploading by bytes
            //console.log(event.loaded + ' of ' + event.total + ' Bytes');
            if (this.uploadDialogRef && this.uploadDialogRef.componentInstance) {
              this.uploadDialogRef.componentInstance.data.progress = (100 * event.loaded) / event.total
            }
          }).send((err: any, data: any) => {
            if (err) {
              console.log('Upload canceled : ', err);
              return false;
            } else {
              const uploadedFile: File = {
                key: data.Key,
                name: filename,
                type: /[^.]*$/.exec(filename)![0],
                size: this.uploadFileSize,
                uploadTime: new Date().toLocaleString(),
                formattedSize: this.formatSize(this.uploadFileSize),
                markedForDelete: false
              }

              this.dataSource.data.push(uploadedFile)
              this.dataSource.data = [...this.dataSource.data]
              return true;
            }

          });
        })
        return new Promise(() => {
        })
      })).pipe(take(1)).subscribe()

    }, error => {
      console.log(AWS_TEMPORARY_CREDENTIALS_ERROR_MESSAGE, error)
    })
  }

  public hasDeletePermission(key: string): boolean {
    return this.isCompanyAdministrator ? true : key.includes(this.username)
  }

  private formatSize(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
