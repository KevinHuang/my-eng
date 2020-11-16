import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class LearnGroupService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }


  /** 取得我的主題清單 */
  public getMyGroups(): Observable<GroupInfo[]> {
    const url = `${this.config.API_GROUP_BASE}/getMyGroups`;
    return this.http.get(url).pipe(
      map(v => (v as GroupInfo[]))
    );
  }
  /** 取得我的主題清單 */
  public joinGroup(groupCode: string): Observable<any> {
    const url = `${this.config.API_GROUP_BASE}/joinGroup`;
    const data = { group_code: groupCode };
    console.log(` post to joinGroup service .... ${url}, ${data}`);
    return this.http.post(url, data).pipe(
      map(v => (v as any))
    );
  }
  /** 取得我的主題清單 */
  public removeGroup(groupId: string): Observable<any> {
    const url = `${this.config.API_GROUP_BASE}/removeGroup`;
    const data = { group_id: groupId } ;
    return this.http.post(url, data).pipe(
      map(v => (v as any))
    );
  }
}


export interface GroupInfo {
  id: number ;
  group_name: string;
  group_code: string;
  is_active: boolean;
  role: string;
  subrole: string;
}
