import { QuestionStatisticsInfo } from './../../service/quiz.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/service/quiz.service';

@Component({
  selector: 'app-question-explain',
  templateUrl: './question-explain.component.html',
  styleUrls: ['./question-explain.component.css']
})
export class QuestionExplainComponent implements OnInit {

  quizsheetUuid = '';
  questionId = '';
  currentQuizSheet: QuestionStatisticsInfo[];
  currentQ: QuestionStatisticsInfo;

  correctAnswer = '';
  userAnswer = '';

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.quizsheetUuid = params.qs_uuid;
      this.questionId = params.question_id;
      console.log(this.quizsheetUuid);

      this.quizService.getQuestionAndAnswers(this.quizsheetUuid).subscribe( qs => {
        qs.forEach(q => {
          if (q.id.toString() === this.questionId) {
            this.currentQ = q ;
          }
        });

        console.log(this.currentQ);

        if (this.currentQ && this.currentQ.history) {
          this.currentQ.options.forEach( opt => {
            console.log(`${opt.value.toString()} => ${this.currentQ.answer}`);
            if (opt.value.toString() === this.currentQ.answer.toString()) {
              this.correctAnswer = opt.text ;
            }
            if (opt.value.toString() === this.currentQ.user_answer.toString()) {
              this.userAnswer = opt.text ;
            }
          });
        }

        console.log(` user Answer: ${this.userAnswer}`);
        console.log(` correct Answer: ${ this.correctAnswer}`);

      });
    });
  }


}
