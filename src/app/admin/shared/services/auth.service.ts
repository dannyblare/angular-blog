import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FbAuthResponse, User } from "src/app/shared/interfaces";
import { Observable, tap, catchError, Subject, throwError } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({providedIn: 'root'})
export class AuthService {

    public error$: Subject<string> = new Subject<string>()

constructor( private http: HttpClient){

}


get token (): string | null {
  const fbTokenExp = localStorage.getItem('fb-token-exp');
  if (fbTokenExp) {
    const expDate = new Date(fbTokenExp);
    if ( new Date > expDate ) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }
  return null;
}

login(user: User): Observable<any>{
 user.returnSecureToken = true
 return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
 .pipe(
    tap<any>(this.setToken),
  
    
    catchError(this.handleError.bind(this))
 )
}



logout(){
  this.setToken(null)
}

isAuthenticated(): boolean {
 return !!this.token
 
}

private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error;
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Такого Email не существует');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль');
        break;
      case 'INVALID_EMAIL':
        this.error$.next('Неверный email');
        break;
    }
    return throwError(error);
  }

  private setToken(response: FbAuthResponse | null) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }
  }

}