import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(
    private service: UserService,
    private router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.service.logged) {
        return true;
      } else {
        this.router.navigate(['/entrar'], { queryParams: { returnUrl: state.url }});
        return false;
      }
  }
}
