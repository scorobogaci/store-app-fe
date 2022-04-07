import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Auth} from "aws-amplify";
import {noop} from "rxjs";

export interface PeriodicElement {
  name: string;
  type: string;
  uploadTime: string
  size: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},
  {name: 'ice-cube-documentary', type: '.mov', uploadTime: '2021-14-11 13:00:00', size: '11 GB'},

];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'uploadTime', 'size','actions'];
  dataSource = ELEMENT_DATA;

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
