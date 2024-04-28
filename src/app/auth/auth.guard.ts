import {inject} from '@angular/core';
import {CanActivateFn} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

export const AuthGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  return authService.isAuthorized();
};
