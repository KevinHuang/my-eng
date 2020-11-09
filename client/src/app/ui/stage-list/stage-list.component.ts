import { TopicInfo, QuizService, QuizProgressInfo } from './../../service/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stage-list',
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.css']
})
export class StageListComponent implements OnInit {

  topics: TopicInfo[];
  groups: string[] = [];
  dicTopicsByGroup: {[grpName: string]: TopicInfo[]} = {};

  quizsheets: QuizProgressInfo[] = [];
  dicQuizSheetsByTopic: {[topic_id: string]: QuizProgressInfo[]} = {};

  panelOpenState = false;

  constructor(
    private quizService: QuizService ,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // tslint:disable-next-line:typedef
  async ngOnInit() {
    this.topics = await this.quizService.getMyTopics().toPromise();
    this.quizsheets = await this.quizService.getMyQuizProgress().toPromise();
    this.parseQuizSheets();
    this.parseTopics();
  }

  parseQuizSheets(): void {
    this.quizsheets.forEach(qs => {
      if (!this.dicQuizSheetsByTopic[qs.topic_id]) {
        this.dicQuizSheetsByTopic[qs.topic_id] =  [];
      }
      this.dicQuizSheetsByTopic[qs.topic_id].push(qs);
    });
  }

  parseTopics(): void {
    this.groups = [];
    this.dicTopicsByGroup = {};
    this.topics.forEach(topic => {
      if (!this.dicTopicsByGroup[topic.group_name]) {
        this.dicTopicsByGroup[topic.group_name] = [];
        this.groups.push(topic.group_name);
      }
      this.dicTopicsByGroup[topic.group_name].push(topic);

      // 找出 quizProgressInfo
      if (this.dicQuizSheetsByTopic[topic.topic_id.toString()]) {
        topic.quiz_progress = this.dicQuizSheetsByTopic[topic.topic_id.toString()];
        let rightCount = 0;
        topic.quiz_progress.forEach(quizProgress => {
          rightCount += (quizProgress.is_pass ? 1 : 0);
        });
        topic.quiz_sheet_pass_count = rightCount ;  // 通過的試卷數
      } else {
        topic.quiz_progress = [];
        topic.quiz_sheet_pass_count = 0;
      }
    });
  }

  showTopic(topic: TopicInfo): void {
    console.log(topic);
    this.router.navigate([ topic.topic_uuid ], { relativeTo: this.route });
  }

  showQuizSheet(qs: QuizProgressInfo): void {
    console.log(qs);
  }

}
