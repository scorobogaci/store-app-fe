import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {noop, Observable} from 'rxjs';
import {AuthService} from "./services/auth.service";
import {ADD_USER_PAGE} from "./constants";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if (this.authService.isCompanyAdministrator()) {
    //   this.router.navigate([ADD_USER_PAGE]).then(noop)
    //   return false
    // }
    return this.authService.isAuthenticated()
  }
}
