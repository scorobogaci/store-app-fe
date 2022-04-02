import {Injectable} from '@angular/core';
import {CognitoUserSession} from "amazon-cognito-identity-js";
import {fromPromise} from 'rxjs/internal-compatibility';
import {noop, Observable, throwError} from "rxjs";
import {catchError, map} from 'rxjs/operators';
import {Auth} from "aws-amplify";
import {Router} from "@angular/router";
import {Nullable} from "../types";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {
  }

  public login(): Observable<CognitoUserSession | void> {
    return fromPromise(Auth.currentSession()).pipe(
      catchError((error) => {
        this.router.navigate(['/login']).then(noop, noop);
        return throwError(error);
      })
    );
  }

  public singOut(): void {
    Auth.signOut().then(
      () => {
        this.router.navigate(['logout_callback']).then(noop, noop);
      },
      () => {
        console.log('logout error');
      }
    );
  }

  public isAuthenticated(): Observable<boolean> {
    return this.login().pipe(map(() => true));
  }

  public async getToken() {
    const token = await Auth.currentSession()
    return token.getIdToken().getJwtToken()
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
