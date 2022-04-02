import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";
import {CONFIG} from "../config/config";
import {Auth} from "aws-amplify";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private authService: AuthService, private http: HttpClient) {
  }

  public createUserResources(): void {
    const createUserResourcesUri = '/add-user'
    this.http.post(CONFIG.baseApiUrl.concat(createUserResourcesUri), '').subscribe(response => {
      console.log("got back the response from api gateway : ", response)
    })

    // get user attributes
    Auth.currentAuthenticatedUser().then(currentUser => {
      console.log("current authenticated user : ", currentUser)
    })

    // get user groups
    Auth.currentSession().then(session => {
      if (session) {
        const userGroup = session.getIdToken().payload['cognito:groups']
        console.log("user group : ", userGroup[0])
      }
    })
  }
}
