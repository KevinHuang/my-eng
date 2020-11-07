import { UserInfo, UserService } from './service/user.service';
import { ChangeDetectorRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-eng';

  navItems = [1, 2, 3, 4, 5];
  contents = ['A', 'B', 'C', 'D', 'E', 'A', 'B', 'C', 'D', 'E'];
  mobileQuery: MediaQueryList;

  // tslint:disable-next-line:variable-name
  private _mobileQueryListener: () => void;

  userInfo: UserInfo;
  hasSignIn = false ;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private userService: UserService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  // tslint:disable-next-line: typedef
  async ngOnInit() {
    this.userInfo = await this.userService.getMyInfo().toPromise();
    if (this.userInfo && this.userInfo.user_id ) {
      this.hasSignIn = true;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  // tslint:disable-next-line:typedef
  signIn() {
    window.location.href = '/signin/google';
  }

  async signOut() {
    await this.userService.signout().toPromise();
    window.location.href = '/';
  }

}
