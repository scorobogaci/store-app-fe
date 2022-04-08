import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CONFIG} from "../config/config";
import {Observable} from "rxjs";
import {
  AddUserRequest,
  AddUserResponse,
  CompaniesResponse, DeleteFileRequest,
  DeleteFileResponse,
  GetCompanyFilesResponse
} from "../types";
import {flatMap} from "rxjs/internal/operators";

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

  public getCompanyFiles(): Observable<GetCompanyFilesResponse> {
    const getFilesResourceUri = '/get-files'
    return this.authService.getUserGroups().pipe(flatMap(groups => {
      return this.http.get<GetCompanyFilesResponse>(CONFIG.baseApiUrl.concat(getFilesResourceUri), {
        params: new HttpParams().set('company', groups[0])
      })
    }))
  }

  public deleteFile(deleteFileRequest: DeleteFileRequest): Observable<DeleteFileResponse> {
    const deleteFileUri = '/delete-file'
    return this.http.post<DeleteFileResponse>(CONFIG.baseApiUrl.concat(deleteFileUri), deleteFileRequest)
  }

  public downloadFile(key: string): Observable<string> {
    const downloadFileResourceUri = '/download-file'
    return this.http.get<string>(CONFIG.baseApiUrl.concat(downloadFileResourceUri), {
      params: new HttpParams().set('key', key)
    })
  }

}
