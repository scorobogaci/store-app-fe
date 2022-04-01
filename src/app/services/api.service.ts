import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private authService: AuthService, private http: HttpClient) {
  }

  //http example : https://jasonwatmore.com/post/2019/11/21/angular-http-post-request-examples
  public createUser(): void {
    this.http.post('https://zr5a8pgjv5.execute-api.us-east-1.amazonaws.com/prod/add-user', '').subscribe(response => {
      console.log("got back the response from api gateway : ", response)
    })
  }
}
