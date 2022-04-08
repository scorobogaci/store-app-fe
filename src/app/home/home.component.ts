import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Auth} from "aws-amplify";
import {noop} from "rxjs";
import {ApiService} from "../services/api.service";
import {File} from "../types";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'uploadTime', 'size', 'actions'];
  dataSource: File[] = [];
  public username: string = ''
  public isCompanyAdministrator = false

  constructor(private router: Router, private apiService: ApiService, private authService: AuthService) {
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

  public logout(): void {
    Auth.signOut().then(
      () => this.router.navigate(['login']).then(noop),
      (error) => console.log('Error to sign out the user : ', error)
    );
  }

}
