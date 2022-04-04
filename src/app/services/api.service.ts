import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";
import {CONFIG} from "../config/config";
import {Observable} from "rxjs";
import {AddUserRequest, AddUserResponse, CompaniesResponse} from "../types";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private authService: AuthService, private http: HttpClient) {
  }

  public addUser(addUserRequest: AddUserRequest): Observable<AddUserResponse> {
    const createUserResourcesUri = '/add-user'
    return this.http.post<AddUserResponse>(CONFIG.baseApiUrl.concat(createUserResourcesUri), addUserRequest)
  }

  public getCompanies(): Observable<CompaniesResponse> {
    const getCompaniesResourceUri = '/get-companies'
    return this.http.get<CompaniesResponse>(CONFIG.baseApiUrl.concat(getCompaniesResourceUri))
  }

}
