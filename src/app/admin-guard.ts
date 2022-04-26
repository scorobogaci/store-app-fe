import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {noop, Observable} from "rxjs";
import {AuthService} from "./services/auth.service";
import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {ADMINISTRATORS_GROUP, HOME_PAGE} from "./constants";

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getUserGroup().pipe(map(userGroup => {
      if (ADMINISTRATORS_GROUP === userGroup) {
        return true
      } else {
        this.router.navigate([HOME_PAGE]).then(noop)
        return false
      }
    }))


  }

}
