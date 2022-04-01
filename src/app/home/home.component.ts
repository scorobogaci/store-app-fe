import {Component, OnInit} from '@angular/core';
import {Route, Router} from "@angular/router";
import {Auth} from "aws-amplify";
import {noop} from "rxjs";
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private apiService: ApiService) {
  }

  ngOnInit(): void {
    console.log("invoking api service from home page")
    this.apiService.createUser()
  }

  public logout(): void {
    Auth.signOut().then(
      () => this.router.navigate(['login']).then(noop),
      (error) => console.log('Error to sign out the user : ', error)
    );
  }

}
