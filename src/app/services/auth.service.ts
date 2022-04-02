import {Injectable} from '@angular/core';
import {CognitoUserSession} from "amazon-cognito-identity-js";
import {fromPromise} from 'rxjs/internal-compatibility';
import {noop, Observable, throwError} from "rxjs";
import {catchError, map} from 'rxjs/operators';
import {Auth} from "aws-amplify";
import {Router} from "@angular/router";
import {Nullable} from "../types";
import {LOGIN_PAGE} from "../constants";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {
  }

  public login(): Observable<CognitoUserSession> {
    return fromPromise(Auth.currentSession()).pipe(
      catchError((error) => {
        this.router.navigate([LOGIN_PAGE]).then(noop, noop);
        return throwError(error);
      })
    );
  }

  public getUserGroups(): Observable<string[]> {
    return fromPromise(Auth.currentSession()).pipe(
      map((session: CognitoUserSession) => {
        if (session.isValid()) {
          return session.getIdToken().payload['cognito:groups']
        } else {
          return [];
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  public isAuthenticated(): Observable<boolean> {
    return this.login().pipe(map(() => true));
  }

  public getAccessToken(): Observable<Nullable<string>> {
    return fromPromise(Auth.currentSession()).pipe(
      map((session: CognitoUserSession) => {
        if (session.isValid()) {
          return session.getIdToken().getJwtToken();
        } else {
          return null;
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
