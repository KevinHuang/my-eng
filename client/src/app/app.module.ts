import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatMenuModule} from '@angular/material/menu';



import { MenuComponent } from './ui/menu/menu.component';
import { StatusComponent } from './ui/status/status.component';
import { QuizComponent } from './ui/quiz/quiz.component';
import { StageComponent } from './ui/stage/stage.component';
import { LearnComponent } from './ui/learn/learn.component';
import { StageListComponent } from './ui/stage-list/stage-list.component';
import { PracticeComponent } from './ui/practice/practice.component';
import { PkComponent } from './ui/pk/pk.component';
import { HttpClientModule } from '@angular/common/http';
import { CheckSignInComponent } from './ui/auth/check-sign-in/check-sign-in.component';






@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    StatusComponent,
    QuizComponent,
    StageComponent,
    LearnComponent,
    StageListComponent,
    PracticeComponent,
    PkComponent,
    CheckSignInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
