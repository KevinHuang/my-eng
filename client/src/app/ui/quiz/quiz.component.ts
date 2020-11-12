import { OptionInfo, QuestionInfo } from './../../service/quiz.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/service/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  quizsheetUuid = '';
  quizUuid = '';
  questions: QuestionInfo[] = [];

  currentIndex = -1;
  currentQ: QuestionInfo;
  currentOptions: OptionInfo[] = [];

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.quizsheetUuid = params.qs_uuid;
      this.quizUuid = params.quiz_uuid;

      console.log(this.quizsheetUuid, this.quizUuid);

      this.quizService.getQuestions(this.quizsheetUuid, this.quizUuid).subscribe(questions => {
        this.questions = questions;
        console.log(this.questions);
        if (this.questions.length < 1) {
          alert('此試卷沒有試題');
        } else {
          this.setCurrentQ(0);
        }
      });
    });
  }


  setCurrentQ(qIndex): void {
    this.currentIndex = qIndex;
    if (this.currentIndex > this.questions.length - 1) { this.currentIndex = this.questions.length - 1; }
    if (this.currentIndex < 0) { this.currentIndex = 0; }
    this.currentQ = this.questions[this.currentIndex];
    const tempOptions: OptionInfo[] = this.currentQ.options;
    // 混亂選項順序
    this.currentQ.randomOtions = this.randomOptions(this.currentQ.options);
    console.log(this.currentIndex);

    console.log(this.currentQ);
  }

  randomOptions(options: OptionInfo[]): OptionInfo[] {
    if (options) {
      return options.sort((x, y): number => {
        return 0.5 - Math.random();
      });
    } else {
      return options;
    }
  }

  previousQ(): void {
    this.setCurrentQ(this.currentIndex - 1);
  }

  nextQ(): void {
    this.setCurrentQ(this.currentIndex + 1);
  }

  async setAnswer(opt: OptionInfo): Promise<void> {
    console.log(opt);
    await this.quizService.setAnswer(this.quizsheetUuid, this.quizUuid, this.currentQ.id.toString(), opt.value.toString()).toPromise();
    this.currentQ.user_answer = opt.value.toString() ;
  }
}


