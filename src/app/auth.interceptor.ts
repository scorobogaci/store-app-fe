import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {from, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handle(req, next))
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = await this.authService.getAccessToken().toPromise()
    const authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: authToken!
      }
    })

    return next.handle(authReq).toPromise()
  }

}
