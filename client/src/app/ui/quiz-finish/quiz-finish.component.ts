import { QuizInfo } from './../../service/quiz.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/service/quiz.service';

@Component({
  selector: 'app-quiz-finish',
  templateUrl: './quiz-finish.component.html',
  styleUrls: ['./quiz-finish.component.css']
})
export class QuizFinishComponent implements OnInit {

  quizsheetUuid = '';
  quizUuid = '';

  quiz: QuizInfo ;
  totalCount = '';
  rightCount = '' ;
  accuracy = '';

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

      this.quizService.getQuizInfo(this.quizUuid).subscribe( qz => {
        this.quiz = qz ;
        if (this.quiz) {
          this.totalCount = this.quiz.total_count.toString() ;
          this.rightCount = this.quiz.right_count.toString() ;
          if (this.quiz.total_count !== 0) {
            this.accuracy = (Math.ceil( this.quiz.right_count * 100 * 10 / this.quiz.total_count ) / 10).toString() ;
          } else {
            this.accuracy = '0';
          }
        }
      });

    });
  }

  backToQuizsheet(): void {
    this.router.navigate(['quizsheet', this.quizsheetUuid]);
  }

}
