import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./services/auth.service";
import {map, take} from "rxjs/operators";
import {Nullable} from "./types";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.authService.getAccessToken().pipe(take(1)).subscribe(token => {
      console.log("we actually have the token, but after : ", token)
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Authorization': `${token}`,
        },
      });
    })
    return next.handle(req);
  }

}
