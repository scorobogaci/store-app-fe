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

  public createUserResources(): void {
    const createUserResourcesUri = '/add-user'
    this.http.post(CONFIG.baseApiUrl.concat(createUserResourcesUri), '').subscribe(response => {
      console.log("got back the response from api gateway : ", response)
    })
  }

  public async getCompanies(): Promise<string[]> {
    const getCompaniesResourceUri = '/get-companies'
    return await new Promise((resolve, reject) => {
      this.http.get<string[]>(CONFIG.baseApiUrl.concat(getCompaniesResourceUri)).subscribe(companies => {
        resolve(companies)
      })
    })
  }
}
