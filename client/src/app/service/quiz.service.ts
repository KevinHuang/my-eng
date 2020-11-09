import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }



  /** 取得我的個人資訊 */
  public getMyTopics(): Observable<TopicInfo[]> {

      const url = `${this.config.API_QUIZ_BASE}/getMyTopics`;
      return this.http.get(url).pipe(
        map(v => (v as TopicInfo[]))
      );
  }
}

export interface TopicInfo {
  group_name: string;
  topic_id: number ;
  topic_name: string;
  description: string;
  topic_uuid: string;
}
