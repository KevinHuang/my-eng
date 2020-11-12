import { QuizFinishComponent } from './ui/quiz-finish/quiz-finish.component';
import { QuizsheetComponent } from './ui/quizsheet/quizsheet.component';
import { AuthGuard } from './ui/auth/auth.guard';
import { PkComponent } from './ui/pk/pk.component';
import { PracticeComponent } from './ui/practice/practice.component';
import { StageListComponent } from './ui/stage-list/stage-list.component';
import { LearnComponent } from './ui/learn/learn.component';
import { StageComponent } from './ui/stage/stage.component';
import { QuizComponent } from './ui/quiz/quiz.component';
import { StatusComponent } from './ui/status/status.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckSignInComponent } from './ui/auth/check-sign-in/check-sign-in.component';

const routes: Routes = [
  { path: 'checkSignIn', component: CheckSignInComponent },
  { path: 'status', component: StatusComponent },
  {
    path: 'topic', component: StageListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'quizsheet/:qs_uuid', component: QuizsheetComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'quizsheet/:qs_uuid/quiz/:quiz_uuid', component: QuizComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'quizsheet/:qs_uuid/quiz/:quiz_uuid/finish', component: QuizFinishComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/topic', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
