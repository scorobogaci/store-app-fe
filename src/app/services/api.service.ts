import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";
import {CONFIG} from "../config/config";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private authService: AuthService, private http: HttpClient) {
  }

  //http example : https://jasonwatmore.com/post/2019/11/21/angular-http-post-request-examples
  public createUserResources(): void {
    const createUserResourcesUri = '/add-user'
    this.http.post(CONFIG.baseApiUrl.concat(createUserResourcesUri), '').subscribe(response => {
      console.log("got back the response from api gateway : ", response)
    })
  }
}
