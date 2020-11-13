import { QuizProgressInfo, QuizService } from './../../service/quiz.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quizsheet',
  templateUrl: './quizsheet.component.html',
  styleUrls: ['./quizsheet.component.css']
})
export class QuizsheetComponent implements OnInit {

  quizsheetUuid = '';
  currentQuizSheet: QuizProgressInfo;
  passRate = 0;

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    // 理論上，會從前一個畫面把 QuizSheet 物件傳過來
    this.currentQuizSheet = this.quizService.getCurrentQuizSheet();
    // 但如果是直接開啟 url，就只有 quizsheet uuid，需要再讀取。
    if (!this.currentQuizSheet) {
      this.route.params.subscribe(params => {
        this.quizsheetUuid = params.qs_uuid;
        console.log(this.quizsheetUuid);
        this.quizService.getQuizProgress(this.quizsheetUuid).subscribe( qs => {
          this.currentQuizSheet = qs ;
          if (this.currentQuizSheet) {
            if (this.currentQuizSheet.question_total_count > 0) {
              this.passRate = Math.ceil( this.currentQuizSheet.question_right_count * 100 * 10 / this.currentQuizSheet.question_total_count) / 10;
            }
          }
        });
      });
    }
  }

  async startQuiz(): Promise<void> {
    const quiz = await this.quizService.startQuiz(this.currentQuizSheet.quiz_sheet_uuid).toPromise();
    console.log(quiz);
    this.router.navigate(['quiz', quiz.current_uuid], { relativeTo: this.route});
  }

}
