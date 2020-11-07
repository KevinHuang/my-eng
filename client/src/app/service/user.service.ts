import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // tslint:disable-next-line:variable-name
  private _hasSignedIn = false;
  private myInfo ;

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  get hasSignedIn(): boolean {
    return this._hasSignedIn ;
  }

  set hasSignedIn(isSignIn: boolean) {
    this._hasSignedIn = isSignIn ;
  }

  public isSignIn(): Observable<boolean> | boolean {
    if (this._hasSignedIn) {
      return true ;
    }
    const url = `${this.config.API_USER_BASE}/isSignIn`;
    return  this.http.get(url).pipe(
      map (result => {
        const signinStatus = result as SignInStatus ;
        this._hasSignedIn = signinStatus.signin ;
        return signinStatus.signin;
      })
    );
  }

  /** 取得我的個人資訊 */
  public getMyInfo(): Observable<UserInfo> {
    if (this.myInfo) {
      return of(this.myInfo) ;
    } else {
      const url = `${this.config.API_USER_BASE}/my_info`;
      return this.http.get(url).pipe(
        map(v => (v as UserInfo))
      );
    }
  }

  // tslint:disable-next-line:ban-types
  public signout(): Observable<Object> {
    const url = `${this.config.API_USER_BASE}/signout`;
    return this.http.get(url);
  }

  public setUserInfo(uInfo: UserInfo): void {
    this.myInfo = uInfo ;
  }
}


/**
 * {
    signinType: "google",
    email: "kevin.huang@ischool.com.tw",
    given_name: "俊傑",
    family_name: "黃",
    sso_identity: "113192269053149405071",
    user_id: "kevin.huang@ischool.com.tw"
   }
 */
export interface UserInfo {
  signinType: string;
  email: string;
  given_name: string;
  family_name: string;
  sso_identity: string;
  user_id: string;
}

export interface SignInStatus {
  signin: boolean ;
}


