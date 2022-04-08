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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'type', 'uploadTime', 'size', 'actions'];
  public dataSource: File[] = [];
  public username: string = ''
  public isCompanyAdministrator = false

  private dialogTitle = "You're about to delete a file from company's storage"
  private dialogMessage = "Are you sure you want to perform this action ?"

  constructor(private router: Router,
              private apiService: ApiService,
              private authService: AuthService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.authService.isCompanyAdministrator().subscribe(isCompanyAdministrator => {
      this.isCompanyAdministrator = isCompanyAdministrator
    }, error => {
      console.log('Error while checking if user is company administrator : ', error)
    })

    this.authService.getUsername().subscribe(username => {
      this.username = username
    }, error => {
      console.log('Error while getting username : ', error)
    })

    this.apiService.getCompanyFiles().subscribe(response => {
      this.dataSource = response.companyFiles
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

  public downloadFile(key: string, name: string): void {
    this.apiService.downloadFile(key).pipe(take(1)).subscribe(url => {
      console.log("url : ", url)
      //window.open(url, '_top');
      //window.location.href = url
      // const link = document.createElement("a")
      // link.href = url
      // link.setAttribute("download", "")
      // link.click()
      // console.log("file should be loaded")

      //window.location.assign(url)
      //window.open(url,'Download')

      //const testUrl = "https://payroll-portal-dev-uploads.s3.eu-west-1.amazonaws.com/customers/34e65858-7c12-4b09-ab8d-01e06d29bd8d/credit_check/reports/Kredietcheck%20rapport_Wambo_DPG%20Media%20B.V._22-10-2021?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEAaCmV1LW5vcnRoLTEiRzBFAiAozmwBVzV9x4og2QS4jE4lX%2FQYwFhvBZspsFQsNQAY2AIhANLj77a0bkAPgTSt%2Fchmijz0IhgJ6s2qdsgKrQFcsAbMKooDCNr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMMTMzNzcxNTkzOTUwIgwTwcQnajK0ozdnjZgq3gIyABmjYB5vtaAl4Y4tCLgKSrDrnitLsIuLL%2B7AePm7j0wlS1plhY87RiCKnyIYlFXsDIlyjxgin6wWOXUvJPjhHuPVL7WlJOaxIlJep4VVL9gio%2Bi5WUxB%2FvpTQlGQNSKOV%2Btbd%2FmfUucYyeaL%2FNQjiHFDnoxzsDEEHG2TfxFVOzHUPULOI%2FQwn6gRJ85w%2BqjY%2FKTXw0mqQ8KlJvHEDrxotg9SPwD504%2B51edlk2%2FiA%2FKPYr6wh00JO%2B1UbIHB%2FC4zCqMNinr5Qlq%2F7m4XBMoeJHFrbYmI2ZeD2OgK5Mr45J4BvPic8SC55hzFo1kiwfc8Cjmtpvs5i8urE3EDLuf8wYfLXNVWIofsmcEViyfNwfcBlKryYQFXGwWEU7am82M2wjb%2FtOPzZ7VGUMqBaxrTik8qJ9eTNTVVbfIHzUFUFqqLenhQA6BLDBZVuATya2SMV7m9M5kvJuFp1HfqZDCY%2FL%2BSBjqzAuP62TTlRURHynifkFRuDoJX5hhjGa0g3kYcSyg4yVrBD5nT8vSs3vzfOknoPrZYC9DP1OxsaPtxDphuyRoSZgqXHgcM9A30dholR1InjIBNY6Nfur34Cq76vEfKFdzZiTvHgb38itH9swAbQk24W8TcEALJ7NUsK0%2BBhGHZPnFSLdhowh4jMc%2B5N7F64GJZOye2DGutjH1QpOIIwOQuPg3h9pQBYPWxgTuJaOJtl2RVBIGTnPTcBT3LTmb3uoLsm79uE6qdPvaTkCZwbnNXpMHXh2Gs5upVWIzTmxjPbnUREApImbpYwEpdb%2FOYL%2FTC1RHXwvKPTBv31MGZDgVtKUDn2yAf3ls49dGa0EzhRveVfkeaphasTLAHRNDX88BQObsSjSQWc%2FTIxXszvHZhPUx3zks%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220408T162952Z&X-Amz-SignedHeaders=host&X-Amz-Expires=420&X-Amz-Credential=ASIAR6JLIRDPKS6E4LKG%2F20220408%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Signature=6c65aea33a759d95b67518ed58daee3e73a91673a17d6ed90f8820388d0fdd11"

      window.open(url,'_top')

      // const xhrObj = new XMLHttpRequest();
      //
      // xhrObj.open('GET', url, true);
      //
      // xhrObj.responseType = "blob";


      //this version at least downloads the file
      // let blob = new Blob([url],{type:'image/png'})
      // console.log("blob : ", blob)
      // let link = document.createElement("a")
      // link.href = URL.createObjectURL(blob)
      // link.download = name
      // link.click()
      //this version at least downloads the file


      // console.log("blob : ", blob)
      //
      // let anotherUrl = window.URL.createObjectURL(blob)
      // window.open(anotherUrl)

      // fetch(url, {method: 'GET'}).then(response => {
      //   console.log("response : ", response)
      // })
      // const link = document.createElement("a")
      // link.href = url
      // document.body.appendChild(link);
      // link.click();
      // console.log("file should be downloaded")
    }, error => {
      console.log("Error on downloading the file : ", error)
    })
  }

  public logout(): void {
    Auth.signOut().then(
      () => this.router.navigate([LOGIN_PAGE]).then(noop),
      (error) => console.log('Error to sign out the user : ', error)
    );
  }

}
