import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Router } from '@angular/router';
  import { Observable, throwError, tap } from 'rxjs';
  import { catchError } from 'rxjs/operators';
import { AuthService } from '../admin/shared/services/auth.service';
  
  
  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {
    constructor(
      private auth: AuthService,
      private router: Router,
    ) {}
  
 /*    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (this.auth.isAuthenticated()) {
        req = req.clone({
          setParams: {
            auth: this.auth.token as string,
          },
        });
      }
  
      return next.handle(req)
        .pipe(
          catchError((error: HttpErrorResponse): any => {
            if (error.status === 404) {
              this.auth.logout();
              this.router.navigate(['/admin', 'login'], {
                queryParams: {
                  authFailed: true,
                },
              }).catch((err) => console.log(err));
            }
            throwError(error);
          }),
        ) as Observable<HttpEvent<any>>;
    }
  } */

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated()) {
      req = req.clone({
        setParams: {
          auth: this.auth.token as string
        }
      })
    }
    return next.handle(req)
      .pipe(
        tap(() => {
          
        }),
        catchError((error: HttpErrorResponse) => {
          console.log('[Interceptor Error]: ', error)
          if (error.status === 401) {
            this.auth.logout()
            this.router.navigate(['/admin', 'login'], {
              queryParams: {
                authFailed: true
              }
            })
          }
          return throwError(error)
        })
      )
  }
}
