import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles'] as string[];

    return this.authenticationService.currentUserRole.pipe(
      take(1),
      map(userRole => {
        // Si no hay roles requeridos, permitir acceso
        if (!requiredRoles || requiredRoles.length === 0) {
          return true;
        }

        // Si el usuario no tiene rol o su rol no está en la lista de roles requeridos
        if (!userRole || !requiredRoles.includes(userRole)) {
          console.warn(`Access denied. User role: ${userRole}, Required roles: ${requiredRoles}`);
          // Redirigir a página de acceso denegado
          this.router.navigate(['/access-denied']);
          return false;
        }

        return true;
      })
    );
  }
}
