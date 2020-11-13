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
    return this.currentQuizSheet;
  }
  setCurrentQuizSheet(quizsheet: QuizProgressInfo): void {
    this.currentQuizSheet = quizsheet;
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

  /** 開始一張試卷的測驗 */
  public startQuiz(quizsheetUuid: string): Observable<QuizInfo> {

    const url = `${this.config.API_QUIZ_BASE}/startQuiz?quizsheet_uuid=${quizsheetUuid}`;
    return this.http.get(url).pipe(
      map(v => (v as QuizInfo))
    );
  }

  public getQuizInfo(quizUuid: string): Observable<QuizInfo> {

    const url = `${this.config.API_QUIZ_BASE}/getQuizInfo?quiz_uuid=${quizUuid}`;
    return this.http.get(url).pipe(
      map(v => (v as QuizInfo))
    );
  }

  /** 開始一張試卷的測驗 */
  public getQuestions(quizsheetUuid: string, quizUuid: string): Observable<QuestionInfo[]> {

    const url = `${this.config.API_QUIZ_BASE}/getQuestions?quizsheet_uuid=${quizsheetUuid}&quiz_uuid=${quizUuid}`;
    return this.http.get(url).pipe(
      map(v => (v as QuestionInfo[]))
    );
  }

  /** 開始一張試卷的測驗 */
  public setAnswer(quizsheetUuid: string,
                   quizUuid: string,
                   questionId: string,
                   ans: string ): Observable<QuestionInfo[]> {

    const url = `${this.config.API_QUIZ_BASE}/setAnswer`;
    const data = { quizsheet_uuid: quizsheetUuid, quiz_uuid: quizUuid, ans, question_id: questionId };
    return this.http.post(url, data).pipe(
      map(v => (v as QuestionInfo[]))
    );
  }

  public getQuestionAndAnswers(quizsheetUuid: string): Observable<QuestionStatisticsInfo[]> {
    const url = `${this.config.API_QUIZ_BASE}/getQuestionAndAnswers?quizsheet_uuid=${quizsheetUuid}`;
    return this.http.get(url).pipe(
      map(v => (v as QuestionStatisticsInfo[]))
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
  quiz_sheet_pass_percent: number;    // 前端運算用
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

export interface QuizInfo {
  id: number;
  ref_member_id: number;
  ref_quiz_sheet_id: number;
  current_uuid: string;
  total_count: number;
  right_count: number;
  history: [];
  last_update: Date;
}

export interface QuestionInfo {
  id: number;
  ref_quiz_sheet_id: number;
  q_order: number;
  type: string;   // 題型, single: 單選, mutiple: 複選, fill: 填充
  ref_article_id: string;
  article: string;
  gq_order: number;
  content: string;
  options: OptionInfo[];
  answer: string; // 可能是填充題
  explain: string;
  quiz_uuid: string;
  user_answer: string; // 可能是填充題;
  randomOtions: OptionInfo[];   // 暫存用戶端混亂過的選項清單
}

export interface QuestionStatisticsInfo extends QuestionInfo {
  history: any[];
  is_correct: boolean;
  total_count: number; // 總答題次數，前端運算用
  right_count: number; // 總答對次數，前端運算用
  correct_rate: number; // 正答率，前端運算用
}

export interface OptionInfo {
  text: string;
  value: number;
}
