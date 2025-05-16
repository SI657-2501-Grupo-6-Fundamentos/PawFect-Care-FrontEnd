import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {map, take} from "rxjs";

/**
 * Guard to check if user is authenticated
 * <p>
 *   If user is not authenticated, it will redirect to sign-in page
 *   and return false
 * </p>
 * @param route The route object that will be used to determine if the user can access the route.
 * @param state The state object that will be used to determine if the user can access the route.
 */
export const authenticationGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  return authenticationService.isSignedIn.pipe(take(1), map(isSignedIn => {
    if (isSignedIn) return true;
    else {
      router.navigate(['/sign-in']).then();
      return false;
    }
  }));
};
