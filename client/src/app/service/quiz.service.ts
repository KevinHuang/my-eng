import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  currentQuizSheet: QuizProgressInfo;

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  getCurrentQuizSheet(): QuizProgressInfo {
    return this.currentQuizSheet ;
  }
  setCurrentQuizSheet( quizsheet: QuizProgressInfo): void {
    this.currentQuizSheet = quizsheet ;
  }

  public getQuizProgress(quizsheetUUID: string): Observable<QuizProgressInfo> {
    const url = `${this.config.API_QUIZ_BASE}/getQuizProgress?quizsheet_uuid=${quizsheetUUID}`;
    return this.http.get(url).pipe(
      map(v => (v as QuizProgressInfo))
    );
  }


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
  topic_id: number;
  topic_name: string;
  description: string;
  topic_uuid: string;
  quiz_progress: QuizProgressInfo[];  // 前端運算用
  quiz_sheet_pass_count: number;    // 前端運算用
}

export interface QuizProgressInfo {
  quiz_sheet_id: string;
  quiz_sheet_name: string;
  quiz_sheet_uuid: string;
  topic_id: string;
  quiz_sheet_order: number;
  question_total_count: number;
  question_right_count: number;
  history: [];
  is_pass: boolean;
}
