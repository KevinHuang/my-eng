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
    path: 'topic', component: StageComponent,
    canActivate: [AuthGuard],
    children: [
      {path: ':topicid/learn', component:  LearnComponent},
      {path: ':topicid/practice', component:  PracticeComponent},
      {path: ':topicid/pk', component:  PkComponent},
      {path: ':topicid', component:  LearnComponent},
      {path: '', component:  StageListComponent},
    ]
  },
  { path: 'quiz', component: QuizComponent },
  { path: '', redirectTo: '/status', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
