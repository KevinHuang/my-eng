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



  /** 取得我的主題清單 */
  public getMyTopics(): Observable<TopicInfo[]> {

      const url = `${this.config.API_QUIZ_BASE}/getMyTopics`;
      return this.http.get(url).pipe(
        map(v => (v as TopicInfo[]))
      );
  }

  /** 取得我的個人資訊 */
  public getMyQuizProgress(): Observable<QuizProgressInfo[]> {

    const url = `${this.config.API_QUIZ_BASE}/getMyQuizProgress`;
    return this.http.get(url).pipe(
      map(v => (v as QuizProgressInfo[]))
    );
}
}

export interface TopicInfo {
  group_name: string;
  topic_id: number ;
  topic_name: string;
  description: string;
  topic_uuid: string;
  quiz_progress: QuizProgressInfo[];  // 前端運算用
  quiz_sheet_pass_count: number;    // 前端運算用
}

export interface QuizProgressInfo {
  quiz_sheet_id: string;
  quiz_sheet_name: string;
  topic_id: string;
  sheet_order: number;
  total_count: number;
  right_count: number;
  history: [];
  is_pass: boolean;
}
