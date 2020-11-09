import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  /** Service 位置。 */
  // public service_host = environment.service_host;

  /** 呼叫 API 時基礎位置 */
  public get API_BASE(): string {
    return 'api';
  }

  /** 呼叫 API 時管理者的 base url。 */
  public get API_ADMIN_BASE(): string {
    return `${this.API_BASE}/admin`;
  }

  /** 呼叫 API 時一般用戶的 private url。 */
  public get API_USER_BASE(): string {
    return `${this.API_BASE}/user`;
  }

  /** 測驗功能 API url。 */
  public get API_QUIZ_BASE(): string {
    return `${this.API_BASE}/quiz`;
  }


  public get DSNS_HOST(): string {
    return 'https://dsns.ischool.com.tw';
  }
}
