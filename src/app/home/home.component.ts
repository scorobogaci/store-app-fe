import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Auth} from "aws-amplify";
import {noop} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  public logout(): void {
    Auth.signOut().then(
      () => this.router.navigate(['login']).then(noop),
      (error) => console.log('Error to sign out the user : ', error)
    );
  }

}
