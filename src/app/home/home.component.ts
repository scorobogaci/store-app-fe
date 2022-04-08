import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Auth} from "aws-amplify";
import {noop} from "rxjs";
import {ApiService} from "../services/api.service";
import {File} from "../types";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'uploadTime', 'size', 'actions'];
  dataSource: File[] = [];

  constructor(private router: Router, private apiService: ApiService) {
  }

  ngOnInit(): void {
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
